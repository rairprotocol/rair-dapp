const express = require('express');
const jwt = require('jsonwebtoken');
const metaAuth = require('@rair/eth-auth')({ dAppName: 'RAIR Inc.' });
const { checkBalanceSingle } = require('../integrations/ethers/tokenValidation.js');
const _ = require('lodash');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const { ObjectId } = require('mongodb');
const { nanoid } = require('nanoid');
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
        owner: ownerAddress.toLowerCase()
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    '$contract',
                    '$$contractT'
                  ]
                },
                {
                  $eq: [
                    '$offerPool',
                    '$$offerP'
                  ]
                },
                {
                  $eq: [
                    '$offer',
                    '$$of'
                  ]
                },
                {
                  $eq: [
                    '$ownerAddress',
                    '$$owner'
                  ]
                }
              ]
            }
          }
        }
      ],
      as: 'tokens'
    },
  },
  { $unwind: '$tokens' },
  { $replaceRoot: { newRoot: '$tokens' } }
]);

module.exports = context => {
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
  router.get('/get_challenge/:MetaAddress', validation('getChallenge', 'params'), metaAuth, function (req, res) {
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
      let ownsTheAccessTokens;
      const file = await context.db.File.findOne({ _id: mediaId });

      if (ethAddres) {
        // verify the user have needed tokens
        ownsTheAccessTokens = await getTokensForUser(context, ethAddres, file);

        // TODO: have to be the call functionality of tokens sync
        // if (_.isEmpty(ownsTheAccessTokens)) {
        //   ownsTheAccessTokens = await getTokensForUser(context, ethAddres, file);
        // }

        // verify the account holds the required NFT
        if (typeof file.author === 'string' && file.author.length > 0 && _.isEmpty(ownsTheAccessTokens)) {
          const [contractAddress, tokenId] = file.author.split(':');
          log.info('Verifying account has token');
          try {
            ownsTheAdminToken = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);
          } catch (e) {
            return next(new Error(`Could not verify account: ${ e }`));
          }
        }

        if (!ownsTheAdminToken && _.isEmpty(ownsTheAccessTokens)) {
          res.status(403).send({ success: false, message: 'You don\'t have permission.' });
        }

        jwt.sign(
          { eth_addr: ethAddres, media_id: mediaId },
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
          (err, token) => {
            if (err) next(new Error('Could not create JWT'));
            res.send({ success: true, token });
          });
      } else {
        return res.sendStatus(400);
      }
    } catch (err) {
      log.error(err);
      res.sendStatus(404);
    }
  });

  // Verify with a Metamask challenge if the user holds the current Administrator token
  router.get('/admin/:MetaMessage/:MetaSignature/', validation('admin', 'params'), metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered;

    try {
      if (ethAddres) {
        let user = await context.db.User.findOne({ publicAddress: ethAddres });

        if (_.isNull(user)) {
          return res.status(404).send({ success: false, message: 'User not found.' });
        }

        user = user.toObject();

        const nftIdentifier = _.get(user, 'adminNFT');

        if (typeof nftIdentifier === 'string' && nftIdentifier.length > 0) { // verify the account holds the required NFT!
          const [contractAddress, tokenId] = nftIdentifier.split(':');

          log.info('Verifying user account has the admin token');

          try {
            const ownsTheToken = await checkBalanceSingle(ethAddres, process.env.ADMIN_NETWORK, contractAddress, tokenId);

            if (!ownsTheToken) {
              res.json({ success: false, message: 'You don\'t hold the current admin token' });
            } else {
              res.json({ success: true, message: 'Admin token holder' });
            }
          } catch (e) {
            log.error(e);
            next(new Error('Could not verify account', e));
          }
        }
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      vdlog(err);
      res.sendStatus(400);
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
          context.store.setAdminToken(adminNFT);
          await context.db.User.update({ _id: user._id }, { $set: { adminNFT } });
          log.info('There was no NFT identifier, so', adminNFT, 'is the new admin token');
          res.status(200).json({
            success: true,
            message: 'New NFT set!'
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
              context.store.setAdminToken(adminNFT);
              await context.db.User.update({ _id: user._id }, { $set: { adminNFT } });
              res.json({
                success: true,
                message: 'New NFT set!'
              });
            }
          } catch (e) {
            next(new Error('Could not verify account', e));
          }
        }
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      log.error('New NFT Admin Error:', err);
      res.json({
        success: false,
        message: 'There was an error validating your request'
      });
    }
  });

  router.post('/authentication', validation('authentication'), async (req, res, next) => {
    const { publicAddress, signature, adminRights } = req.body;
    const user = (await context.db.User.findOne({ publicAddress })).toObject();

    if (!user) {
      const message = `User with publicAddress ${ publicAddress } is not found in database`;
      log.error(message);
      return res.status(404).send({
        success: false,
        message
      });
    }

    const msg = `Sign in for RAIR by nonce: ${ user.nonce }`;

    // get the address from signature
    const nonceBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: nonceBufferHex,
      sig: signature,
    });

    if (address !== publicAddress) {
      log.error('Signature verification failed');
      return res.status(401).send({
        success: false,
        message: 'Signature verification failed',
      });
    }

    // Generate a new nonce for the user
    const nonce = nanoid();

    await context.db.User.updateOne({ publicAddress }, { $set: { nonce } });

    jwt.sign(
      { eth_addr: publicAddress, adminRights },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) next(new Error('Could not create JWT'));
        res.send({ success: true, token });
      });
  });

  router.get('/user_info', JWTVerification(context), async (req, res, next) => {
    const user = _.chain(req.user)
      .assign({})
      .omit(['nonce', 'adminNFT'])
      .value();

    res.send({
      success: true,
      user
    });
  });
  return router;
};
