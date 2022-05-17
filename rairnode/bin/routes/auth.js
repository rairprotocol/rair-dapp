const express = require('express');
const jwt = require('jsonwebtoken');
const metaAuth = require('@rair/eth-auth')({ dAppName: 'RAIR Inc.' });
const _ = require('lodash');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const { ObjectId } = require('mongodb');
const { nanoid } = require('nanoid');
const { checkBalanceSingle, checkBalanceProduct } = require('../integrations/ethers/tokenValidation.js');
const { JWTVerification, validation } = require('../middleware');
const log = require('../utils/logger')(module);

const getTokensForUser = async (context, ownerAddress, { offer, contract, product }) => context.db.Offer.aggregate([
  { $match: { offerIndex: { $in: offer }, contract: ObjectId(contract), product } },
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
                  $eq: [
                    '$contract',
                    '$$contractT',
                  ],
                },
                {
                  $eq: [
                    '$offerPool',
                    '$$offerP',
                  ],
                },
                {
                  $eq: [
                    '$offer',
                    '$$of',
                  ],
                },
                {
                  $eq: [
                    '$ownerAddress',
                    '$$owner',
                  ],
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
  /**
   * @swagger
   *
   * /api/auth/get_challenge/{MetaAddress}:
   *   get:
   *     description: Request an auth challenge for the given ethereum address. The challenge could be signed and then sent to /auth/:message/:signature to get a JWT
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
  router.get('/get_challenge/:MetaAddress', validation('getChallenge', 'params'), metaAuth, (req, res) => {
    res.send({ success: true, response: req.metaAuth.challenge });
  });

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
   *         description: If the signer meets the requirments (signature valid, holds required token) returns a JWT which grants stream access.
   */
  router.get('/get_token/:MetaMessage/:MetaSignature/:mediaId', validation('getToken', 'params'), metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered;
    const { mediaId } = req.params;
    try {
      let ownsTheAdminToken;
      const ownsTheAccessTokens = [];
      const file = await context.db.File.findOne({ _id: mediaId });

      if (!file) {
        return res.status(400).send({ success: false, message: 'No file found' });
      }

      const contract = await context.db.Contract.findOne(file.contract);
      const offers = await context.db.Offer.find(_.assign(
        { contract: file.contract },
        contract.diamond ? { diamondRangeIndex: { $in: file.offer } } : { offerIndex: { $in: file.offer } }));

      if (ethAddres) {
        // verify the user have needed tokens

        // Replace with full blockchain authentication
        // ownsTheAccessTokens = await getTokensForUser(context, ethAddres, file);
        // async function checkBalanceProduct (accountAddress, blockchain, contractAddress, productId, offerRangeStart, offerRangeEnd) {
        for await (const offer of offers) {
          ownsTheAccessTokens.push(await checkBalanceProduct(
            ethAddres,
            contract.blockchain,
            contract.contractAddress,
            offer.product,
            offer.range[0],
            offer.range[1],
          ));
          if (ownsTheAccessTokens.includes(true)) {
            break;
          }
        }

        // TODO: have to be the call functionality of tokens sync
        // if (_.isEmpty(ownsTheAccessTokens)) {
        //   ownsTheAccessTokens = await getTokensForUser(context, ethAddres, file);
        // }

        // verify the account holds the required NFT
        if (typeof file.author === 'string' && file.author.length > 0 && !ownsTheAccessTokens.includes(true)) {
          const [contractAddress, tokenId] = file.author.split(':');
          log.info('Verifying account has token');
          try {
            ownsTheAdminToken = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);
          } catch (e) {
            return next(new Error(`Could not verify account: ${e}`));
          }
        }

        if (!ownsTheAdminToken && !ownsTheAccessTokens.includes(true) && !file.demo) {
          return res.status(403).send({ success: false, message: 'You don\'t have permission.' });
        }

        await context.redis.redisService.set(`sess:${ req.sessionID }`, {
          ...req.session,
          eth_addr: ethAddres,
          media_id: mediaId,
          streamAuthorized: true
        });

        res.send({ success: true });
      } else {
        return res.status(400).send({ success: false });
      }
    } catch (err) {
      return next(err);
    }
  });

  // Verify with a Metamask challenge if the user holds the current Administrator token
  router.get('/admin/:MetaMessage/:MetaSignature/', validation('admin', 'params'), metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered;
    const reg = new RegExp(/^0x\w{40}:\w+$/);

    try {
      if (ethAddres) {
        let user = await context.db.User.findOne({ publicAddress: ethAddres });

        if (_.isNull(user)) {
          return res.status(404).send({ success: false, message: 'User not found.' });
        }

        user = user.toObject();

        const nftIdentifier = _.get(user, 'adminNFT', '');

        log.info('Verifying user account has the admin token');

        if (typeof nftIdentifier === 'string' && reg.test(nftIdentifier)) { // verify the account holds the required NFT!
          const [contractAddress, tokenId] = nftIdentifier.split(':');

          try {
            const ownsTheToken = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);

            if (!ownsTheToken) {
              res.json({ success: false, message: 'You don\'t hold the current admin token' });
            } else {
              res.json({ success: true, message: 'Admin token holder' });
            }
          } catch (e) {
            log.error(e);
            next(new Error('Could not verify account.'));
          }
        } else {
          return res.status(400).send({ success: false, message: 'Incorrect credentials.' });
        }
      } else {
        return res.status(400).send({ success: false, message: 'Incorrect credentials.' });
      }
    } catch (err) {
      return next(err);
    }
  });

  // Verify the user holds the current Admin token and then replace it with a new token
  router.post('/new_admin/:MetaMessage/:MetaSignature/', validation('newAdminParams', 'params'), validation('newAdmin'), metaAuth, async (req, res, next) => {
    try {
      const ethAddres = req.metaAuth.recovered;

      if (ethAddres) {
        const user = (await context.db.User.findOne({ publicAddress: ethAddres })).toObject();
        const nftIdentifier = _.get(user, 'adminNFT');
        const { adminNFT } = req.body;

        log.info('New Admin NFT', adminNFT);

        if (!nftIdentifier) {
          await context.db.User.update({ _id: user._id }, { $set: { adminNFT } });
          log.info('There was no NFT identifier, so', adminNFT, 'is the new admin token');
          res.status(200).json({
            success: true,
            message: 'New NFT set!',
          });
          return;
        }

        if (typeof nftIdentifier === 'string' && nftIdentifier.length > 0) { // verify the account holds the required NFT!
          const [contractAddress, tokenId] = nftIdentifier.split(':');

          log.info('Verifying user account has the admin token');

          try {
            const ownsTheToken = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);

            if (!ownsTheToken) {
              res.json({ success: false, message: 'You don\'t hold the current admin token' });
            } else {
              await context.db.User.update({ _id: user._id }, { $set: { adminNFT } });
              res.json({
                success: true,
                message: 'New NFT set!',
              });
            }
          } catch (e) {
            next(new Error('Could not verify account', e));
          }
        }
      } else {
        return res.status(400).send({ success: false });
      }
    } catch (err) {
      log.error('New NFT Admin Error:', err);
      res.json({
        success: false,
        message: 'There was an error validating your request',
      });
    }
  });

  router.get('/authentication/:MetaMessage/:MetaSignature/', validation('authentication', 'params'), metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered;
    const reg = new RegExp(/^0x\w{40}:\w+$/);
    let adminRights = false;

    try {
      if (ethAddres) {
        let user = await context.db.User.findOne({ publicAddress: ethAddres });

        if (_.isNull(user)) {
          return res.status(404).send({ success: false, message: 'User not found.' });
        }

        user = user.toObject();

        const nftIdentifier = _.get(user, 'adminNFT', '');

        log.info('Verifying user account has the admin token');

        // verify the account holds the correct NFT
        if (typeof nftIdentifier === 'string' && reg.test(nftIdentifier)) {
          const [contractAddress, tokenId] = nftIdentifier.split(':');

          try {
            adminRights = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);
          } catch (e) {
            log.error(e);
          }
        }
      } else {
        return res.status(400).send({ success: false, message: 'Incorrect credentials.' });
      }

      jwt.sign(
        { eth_addr: ethAddres, adminRights },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },
        (err, token) => {
          if (err) next(new Error('Could not create JWT'));
          res.send({ success: true, token });
        },
      );
    } catch (err) {
      return next(err);
    }
  });

  router.get('/user_info', JWTVerification(context), async (req, res, next) => {
    const user = _.chain(req.user)
      .assign({})
      .omit(['nonce', 'adminNFT'])
      .value();

    res.send({
      success: true,
      user,
    });
  });

  // Terminating access for video streaming session
  router.get('/stream/out', (req, res, next) => {
    try {
      req.session.streamAuthorized = false;
      delete req.session.media_id;
      res.send({ success: true });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
