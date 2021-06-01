const express = require('express');
const jwt = require('jsonwebtoken');
const metaAuth = require('@rair/eth-auth')({ dAppName: 'RAIR Inc.' });
const { accountTokenBalance } = require('../integrations/eth');
const _ = require('lodash');
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const { JWTVerification } = require('../middleware');
const { nanoid } = require('nanoid');

module.exports = context => {
  const router = express.Router()
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
  router.get('/get_challenge/:MetaAddress', metaAuth, function (req, res) {
    res.send(req.metaAuth.challenge)
  })

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
  router.get('/get_token/:MetaMessage/:MetaSignature/:mediaId', metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered
    const { mediaId } = req.params
    try {
      const { nftIdentifier } = await context.db.File.find({ _id: mediaId });
      if (ethAddres) {
        if (typeof nftIdentifier === 'string' && nftIdentifier.length > 0) { // verify the account holds the required NFT!
          const [contractAddress, tokenId] = nftIdentifier.split(':')
          console.log('verifying account has token', contractAddress, tokenId)
          try {
            const balance = await accountTokenBalance(ethAddres, contractAddress, tokenId)
            if (balance < 1) return next(new Error(`Account does not hold required token ${nftIdentifier}`))
          } catch (e) {
            next(new Error('Could not verify account', e))
          }
        }
        jwt.sign(
          { eth_addr: ethAddres, media_id: mediaId },
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
          (err, token) => {
            if (err) next(new Error('Could not create JWT'))
            res.send(token)
          })
      } else {
        res.sendStatus(400)
      };
    } catch (err) {
      console.log(err)
      res.sendStatus(404)
    }
  })

  // Verify with a Metamask challenge if the user holds the current Administrator token
  router.get('/admin/:MetaMessage/:MetaSignature/', metaAuth, async (req, res, next) => {
    const ethAddres = req.metaAuth.recovered
    // const nftIdentifier = context.store.getAdminToken()
    const users = await context.db.User.find();
    const nftIdentifier = _.chain(users)
      .first()
      .get('adminNFT')
      .value();

    if (nftIdentifier === '') {
      console.log("There's no admin token, Admin panel will be visible for anyone!")
      res.json({
        ok: true,
        message: "There's no Admin token"
      })
    }
    if (ethAddres) {
      if (typeof nftIdentifier === 'string' && nftIdentifier.length > 0) { // verify the account holds the required NFT!
        const [contractAddress, tokenId] = nftIdentifier.split(':')
        console.log('Verifying user account has the admin token')

        try {
          const balance = await accountTokenBalance(ethAddres, contractAddress, tokenId)
          if (balance < 1) {
            res.json({
              ok: false,
              message: "You don't hold the current admin token"
            })
          } else {
            res.json({
              ok: true,
              message: 'Admin token holder'
            })
          }
        } catch (e) {
          next(new Error('Could not verify account', e))
        }
      }
    } else {
      res.sendStatus(400)
    };
  })

  // Verify the user holds the current Admin token and then replace it with a new token
  router.post('/new_admin/:MetaMessage/:MetaSignature/', metaAuth, async (req, res, next) => {
    try {
      const ethAddres = req.metaAuth.recovered
      // const nftIdentifier = context.store.getAdminToken()
      const results = await context.db.User.find();
      const user = _.first(results);
      const nftIdentifier = _.get(user, 'adminNFT');
      const { adminNFT } = req.body

      console.log('New Admin NFT', adminNFT)

      if (nftIdentifier === '') {
        context.store.setAdminToken(adminNFT);
        await context.db.User.update({ _id: user._id }, { adminNFT });
        console.log('There was no NFT identifier, so', adminNFT, 'is the new admin token')
        res.status(200).json({
          ok: true,
          message: 'New NFT set!'
        })
        return
      }

      if (ethAddres) {
        if (typeof nftIdentifier === 'string' && nftIdentifier.length > 0) { // verify the account holds the required NFT!
          const [contractAddress, tokenId] = nftIdentifier.split(':')
          console.log('Verifying user account has the admin token')

          try {
            const balance = await accountTokenBalance(ethAddres, contractAddress, tokenId)
            if (balance < 1) {
              res.json({
                ok: false,
                message: "You don't hold the current admin token"
              })
            } else {
              context.store.setAdminToken(adminNFT);
              await context.db.User.update({ _id: user._id }, { adminNFT });
              res.json({
                ok: true,
                message: 'New NFT set!'
              })
            }
          } catch (e) {
            next(new Error('Could not verify account', e))
          }
        }
      } else {
        res.sendStatus(400)
      };
    } catch (err) {
      console.log('New NFT Admin Error:', err)
      res.json({
        ok: false,
        message: 'There was an error validating your request'
      })
    }
  })

  router.post('/authentication', async (req, res, next) => {
    const { publicAddress, signature, adminRights } = req.body;
    const user = await context.db.User.findOne({ publicAddress });

    if (!user) {
      console.log(`User with publicAddress ${ publicAddress } is not found in database`);
      return res.status(404).send({
        error: `User with publicAddress ${publicAddress} is not found in database`,
      });
    }

    const msg = `Sign in for RAIR by nonce: ${user.nonce}`;

    // get the address from signature
    const nonceBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: nonceBufferHex,
      sig: signature,
    });

    if (address !== publicAddress) {
      console.log('Signature verification failed');
      return res.status(401).send({
        error: 'Signature verification failed',
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
        if (err) next(new Error('Could not create JWT'))
        res.send(token)
      })
  });

  router.get('/user_info', JWTVerification(context), async (req, res, next) => res.send(req.user));
  return router
}
