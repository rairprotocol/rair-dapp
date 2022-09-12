const _ = require('lodash');
const { OfferPool } = require('../models');

exports.getOfferPoolByContractAndProduct = async (req, res, next) => {
  try {
    const { contract } = req;
    const { product } = req.query;

    if (!contract.diamond) {
      const offerPool = await OfferPool.findOne({
        contract: contract._id,
        product,
      });

      if (_.isEmpty(offerPool)) {
        return res.status(404).send({ success: false, message: 'OfferPool not found.' });
      }

      req.offerPool = offerPool;
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
