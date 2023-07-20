const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { generateChallenge, generateChallengeV2, validateChallenge, validateChallengeV2 } = require('../integrations/ethers/web3Signature');
const AppError = require('../utils/errors/AppError');
const {
  checkBalanceProduct,
  checkAdminTokenOwns,
  checkBalanceAny,
} = require('../integrations/ethers/tokenValidation');
const { validation, requireUserSession } = require('../middleware');
const { generateJWT, getMeetingInvite } = require('../integrations/zoom/zoomController');
const log = require('../utils/logger')(module);
const { File, MediaViewLog, User, Contract } = require('../models');

// TODO: remove ARTIFACT

// eslint-disable-next-line no-unused-vars
const getTokensForUser = async (
  context,
  ownerAddress,
  { offer, contract, product },
) =>
  context.db.Offer.aggregate([
    {
      $match: {
        offerIndex: { $in: offer },
        contract: ObjectId(contract),
        product,
      },
    },
    {
      $lookup: {
        from: 'MintedToken',
        let: {
          contractT: '$contract',
          offerP: '$offerPool',
          of: '$offerIndex',
          owner: ownerAddress.toLowerCase(),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$contract', '$$contractT'],
                  },
                  {
                    $eq: ['$offerPool', '$$offerP'],
                  },
                  {
                    $eq: ['$offer', '$$of'],
                  },
                  {
                    $eq: ['$ownerAddress', '$$owner'],
                  },
                ],
              },
            },
          },
        ],
        as: 'tokens',
      },
    },
    { $unwind: '$tokens' },
    { $replaceRoot: { newRoot: '$tokens' } },
  ]);

module.exports = (context) => {
  const router = express.Router();
  router.post(
    '/get_challenge',
    validation(['getChallengeV2']),
    async (req, res, next) => {
      const messages = {
        login: `Login to ${process.env.APP_NAME}. This sign request securely logs you in and will not trigger a blockchain transaction or cost any gas fees.`,
      };
      if (req?.body?.mediaId) {
        const fileData = await File.findById(req.body.mediaId);
        const authorData = await User.findOne({
          publicAddress: fileData?.uploader,
        });
        messages.decrypt = `Complete this signature request to unlock media: ${fileData?.title} by ${authorData?.nickName ? authorData?.nickName : fileData?.uploader}`;
      }
      if (req.body.zoomId) {
        let zoomData;
        if (req.body.zoomId === 'Kohler') {
          zoomData = {
            title: 'Tax Hacks Summit',
            user: 'Mark Kohler',
          };
        } else {
          return next(new AppError('Invalid meeting ID', 400));
        }
        /* const fileData = await context.db.File.findById(req.body.mediaId);
        const authorData = await context.db.User.findOne({
          publicAddress: fileData?.uploader,
        }); */
        messages.decrypt = `Complete this signature request to unlock the meeting: ${zoomData.title} by ${zoomData.user}`;
      }
      req.metaAuth = {
        customDescription: messages[req.body.intent],
      };
      return next();
    },
    generateChallengeV2,
    (req, res, next) => {
      res.send({ success: true, response: req.metaAuth.challenge });
    },
  );

  /**
   * @swagger
   *
   * /api/auth/get_challenge/{MetaAddress}:
   *   get:
   *     description: Request an auth challenge for the given ethereum address.
   *         The challenge could be signed and then sent to /auth/:message/:signature to get a JWT
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: MetaAddress
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Returns a challenge for the client to sign with the ethereum private key
   */
  router.get(
    '/get_challenge/:MetaAddress',
    validation(['getChallenge'], 'params'),
    generateChallenge(`Login to ${process.env.APP_NAME}. This sign request securely logs you in and will not trigger a blockchain transaction or cost any gas fees.`),
    (req, res) => {
      res.send({ success: true, response: req.metaAuth.challenge });
    },
  );

  /**
   * @swagger
   *
   * /api/auth/get_token/{MetaMessage}/{MetaSignature}/{mediaId}:
   *   get:
   *     description: Respond to a challenge to receive a JWT
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: MetaMessage
   *         description: The previously issued challenge
   *         schema:
   *           type: string
   *         required: true
   *       - in: path
   *         name: MetaSignature
   *         description: The user's signature for the provided message
   *         schema:
   *           type: string
   *         required: true
   *       - in: path
   *         name: mediaId
   *         description: The Id of media that an access token is being requested for
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: If the signer meets the requirments
   *            (signature valid, holds required token)
   *          returns a JWT which grants stream access.
   */
  router.get(
    '/get_token/:MetaMessage/:MetaSignature/:mediaId',
    validation(['getToken'], 'params'),
    validateChallenge,
    async (req, res, next) => {
      const ethAddress = req.metaAuth.recovered;
      const { mediaId } = req.params;
      try {
        let ownsTheAdminToken;
        const ownsTheAccessTokens = [];
        const file = await context.db.File.findOne({ _id: mediaId });

        if (!file) {
          return next(new AppError('No file found', 400));
        }

        const contract = await context.db.Contract.findOne(file.contract);
        const offers = await context.db.Offer.find(
          _.assign(
            { contract: file.contract },
            contract.diamond
              ? { diamondRangeIndex: { $in: file.offer } }
              : { offerIndex: { $in: file.offer } },
          ),
        );

        if (ethAddress) {
          // Verify the user has the tokens needed in a RAIR contract
          // eslint-disable-next-line no-restricted-syntax
          for await (const offer of offers) {
            const result = contract.external
              ? await checkBalanceAny(
                ethAddress,
                contract.blockchain,
                contract.contractAddress,
              )
              : await checkBalanceProduct(
                ethAddress,
                contract.blockchain,
                contract.contractAddress,
                offer.product,
                offer.range[0],
                offer.range[1],
              );
            ownsTheAccessTokens.push(result);
            if (ownsTheAccessTokens.includes(true)) {
              break;
            }
          }

          // verify the account holds the required admin NFT
          if (
            !ownsTheAccessTokens.includes(true) &&
            file.uploader === ethAddress.toLowerCase()
          ) {
            try {
              ownsTheAdminToken = await checkAdminTokenOwns(ethAddress);

              if (ownsTheAdminToken) {
                log.info('Verifying user account has the admin token');
              }
            } catch (e) {
              return next(new AppError(`Could not verify account: ${e}`, 403));
            }
          }

          if (
            !ownsTheAdminToken &&
            !ownsTheAccessTokens.includes(true) &&
            !file.demo
          ) {
            return next(new AppError("You don't have permission.", 403));
          }

          const sess = req.session;
          sess.eth_addr = ethAddress;
          sess.media_id = mediaId;
          sess.streamAuthorized = true;

          return res.send({ success: true });
        }
        return next(new AppError('Something went wrong', 400));
      } catch (err) {
        return next(err);
      }
    },
  );

  router.post(
    '/validate/',
    validation(['web3Validation'], 'body'),
    validateChallengeV2,
    async (req, res, next) => {
      const { mediaId, zoomId } = req.body;
      const ethAddress = req.metaAuth.recovered;

      let ownsTheAdminToken;
      const ownsTheAccessTokens = [];

      const user = await User.findOne({
        publicAddress: ethAddress,
      });

      if (user === null) {
        return next(new AppError('User not found.', 404));
      }
      const { session } = req;
      session.userData = user;

      let mediaIdentifier;
      let mediaType;

      try {
        let media;
        if (mediaId) {
          media = await File.findOne({ _id: mediaId });
          mediaIdentifier = mediaId;
          mediaType = 'media';
        } else if (zoomId) {
          // media = await <ZoomSchema>.findOne({ _id: zoomId });
          // Special case for Mark Kohler's Zoom
          if (zoomId === 'Kohler') {
            const kohlerContract = await Contract.findOne({
              contractAddress: '0x711fe7fccdf84875c9bdf663c89b5f5f726a11d7'.toLowerCase(),
              blockchain: '0x1',
            });
            if (!kohlerContract) {
              return next(new AppError('No contract found', 400));
            }
            media = {
              contract: kohlerContract._id,
              offer: '0',
              meetingIdentifier: process.env.KOHLER_MEETING_ID,
            };
          }
          mediaIdentifier = zoomId;
          mediaType = 'zoom';
        }
        if (!media) {
          return next(new AppError('No media file found', 400));
        }

        const contract = await Contract.findOne(media.contract);
        if (!contract) {
          return next(new AppError('No contract found', 400));
        }
        const offers = await context.db.Offer.find(
          _.assign(
            { contract: media.contract },
            contract.diamond
              ? { diamondRangeIndex: { $in: media.offer } }
              : { offerIndex: { $in: media.offer } },
          ),
        );

        // Verify the user has the tokens needed in a RAIR contract
        // eslint-disable-next-line no-restricted-syntax
        for await (const offer of offers) {
          const result = contract.external
            ? await checkBalanceAny(
              ethAddress,
              contract.blockchain,
              contract.contractAddress,
            )
            : await checkBalanceProduct(
              ethAddress,
              contract.blockchain,
              contract.contractAddress,
              offer.product,
              offer.range[0],
              offer.range[1],
            );
          ownsTheAccessTokens.push(result);
          if (ownsTheAccessTokens.includes(true)) {
            break;
          }
        }

        // verify the account holds the required admin NFT
        if (
          !ownsTheAccessTokens.includes(true) &&
          media.uploader === ethAddress.toLowerCase()
        ) {
          try {
            ownsTheAdminToken = await checkAdminTokenOwns(ethAddress);

            if (ownsTheAdminToken) {
              log.info('Verifying user account has the admin token');
            }
          } catch (e) {
            return next(new AppError(`Could not verify account: ${e}`, 403));
          }
        }

        if (
          !ownsTheAdminToken &&
          !ownsTheAccessTokens.includes(true) &&
          !media.demo
        ) {
          return next(new AppError('Unauthorized', 403));
        }
        session.authorizedMediaStream = mediaIdentifier;
        session.authorizedMediaType = mediaType;

        const viewData = new MediaViewLog({
          userAddress: ethAddress,
          file: mediaId,
          decryptedFiles: 0,
        });
        if (mediaId) {
          viewData.save();
          if (!media.views) {
            media.views = 0;
          }
          media.views += 1;
          media.save();
          session.viewLogId = viewData._id;
        }

        if (zoomId) {
          const token = generateJWT();
          try {
            const invites = await getMeetingInvite(media.meetingIdentifier, token, user);
            return res.send({ success: true, invite: invites.attendees?.at(0) });
          } catch (error) {
            log.error(error);
          }
        }

        return res.send({ success: true });
      } catch (err) {
        return next(err);
      }
    },
  );

  // Verify with a Metamask challenge if the user holds the current Administrator token
  router.get(
    '/admin/:MetaMessage/:MetaSignature/',
    validation(['admin'], 'params'),
    validateChallenge,
    async (req, res, next) => {
      const ethAddress = req.metaAuth.recovered;
      try {
        if (ethAddress) {
          const user = await context.db.User.findOne({
            publicAddress: ethAddress,
          });

          if (_.isNull(user)) {
            return next(new AppError('User not found.', 404));
          }

          try {
            const ownsTheToken = await checkAdminTokenOwns(ethAddress);

            if (!ownsTheToken) {
              return next(new AppError("You don't hold the current admin token", 401));
            }
            return res.json({ success: true, message: 'Admin token holder' });
          } catch (e) {
            log.error(e);
            return next(new AppError('Could not verify account.', 401));
          }
        } else {
          return next(new AppError('Incorrect credentials.', 400));
        }
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get(
    '/authentication/:MetaMessage/:MetaSignature/',
    validation(['authentication'], 'params'),
    validateChallenge,
    async (req, res, next) => {
      const ethAddress = req.metaAuth.recovered;
      let adminRights = false;

      try {
        if (ethAddress) {
          const user = await context.db.User.findOne({
            publicAddress: ethAddress,
          });

          if (_.isNull(user)) {
            return next(new AppError('User not found.', 404));
          }

          try {
            adminRights = await checkAdminTokenOwns(ethAddress);

            if (adminRights) {
              log.info('Verifying user account has the admin token');
            }
          } catch (e) {
            log.error(e);
          }
        } else {
          return next(new AppError('Incorrect credentials.', 400));
        }

        jwt.sign(
          {
            eth_addr: ethAddress,
            adminRights,
            superAdmin: req.user.superAdmin,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
          (err, token) => {
            if (err) next(new AppError('Could not create JWT', 401));
            return res.send({ success: true, token });
          },
        );
        return null;
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get('/user_info', requireUserSession, async (req, res, next) => {
    const user = _.chain(req.user).assign({}).omit(['nonce']).value();

    res.send({
      success: true,
      user,
    });
  });

  // Terminating access for video streaming session
  router.get('/stream/out', (req, res, next) => {
    if (req.session) {
      req.session.authorizedMediaStream = undefined;
      req.session.authorizedMediaType = undefined;
    }
    return res.send({ success: true });
  });

  return router;
};
