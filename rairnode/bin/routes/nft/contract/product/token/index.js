const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../../../../../middleware');

module.exports = context => {
  const router = express.Router();

  // Get specific token by internal token ID
  router.get('/', async (req, res, next) => {
    try {
      const { contract, offerPool, token } = req;

      const result = await context.db.MintedToken.findOne({
        contract: contract._id,
        offerPool: offerPool.marketplaceCatalogIndex,
        token
      });

      return res.json({ success: true, result });
    } catch (err) {
      return next(err);
    }
  });

  // Update specific token metadata by internal token ID
  router.put('/', JWTVerification(context), validation('updateTokenMetadata'), async (req, res, next) => {
    try {
      const { contract, offerPool, token } = req;
      const { user } = req;
      let fieldsForUpdate = _.pick(req.body, ['name', 'description', 'artist', 'external_url', 'attributes']);

      if (user.publicAddress !== contract.user) {
        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating token ${ token }.`
        });
      }

      if (_.isEmpty(fieldsForUpdate)) {
        return res.status(400).send({ success: false, message: 'Nothing to update.' });
      }

      fieldsForUpdate = _.mapKeys(fieldsForUpdate, (v, k) =>  `metadata.${k}` );

      const updatedToken = await context.db.MintedToken.findOneAndUpdate({
        contract: contract._id,
        offerPool: offerPool.marketplaceCatalogIndex,
        token
      }, fieldsForUpdate, { new: true });

      return res.json({ success: true, token: updatedToken });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
