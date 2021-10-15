const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../../../middleware');

module.exports = context => {
  const router = express.Router()

  // Get specific token by contract address and unique toke ID in contract
  router.get('/token/:tokenInContract', async (req, res, next) => {
    try {
      const { contract } = req;
      const { tokenInContract } = req.params;
      const uniqueIndexInContract = Number(tokenInContract);

      const result = await context.db.MintedToken.findOne({ contract, uniqueIndexInContract });

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  router.post('/offerPool/:offerPool/authenticityLink', JWTVerification(context), validation('authenticityLinkParams', 'params'), validation('authenticityLink'), async (req, res, next) => {
    try {
      const { contract } = req;
      const { offerPool } = req.params;
      const { link, tokens, description } = req.body;
      const sanitizedOfferPool = Number(offerPool);

      // TODO: have to be updated info about contract || offerPool || token if they not exist

      const tokensForSave = _.map(tokens, token => {
        const sanitizedToken = Number(token);

        return {
          link,
          token: sanitizedToken,
          offerPool: sanitizedOfferPool,
          contract,
          description
        }
      });

      if (!_.isEmpty(tokensForSave)) {
        try {
          await context.db.AuthenticityLink.insertMany(tokensForSave, { ordered: false });
        } catch (e) {}
      }

      res.json({ success: true, storedLinks: tokensForSave.length });
    } catch (err) {
      next(err);
    }
  });

  router.use('/:product', validation('nftProduct', 'params'), (req, res, next) => {
    req.product = Number(req.params.product);
    next();
  }, require('./product')(context));

  return router;
}
