const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
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
        return next(new AppError('OfferPool not found.', 404));
      }

      req.offerPool = offerPool;
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
