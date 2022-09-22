const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const { Offer } = require('../models');
const eFactory = require('../utils/entityFactory');

exports.getOfferById = eFactory.getOne(Offer);
exports.getAllOffers = eFactory.getAll(Offer);

exports.getOfferIndexesByContractAndProduct = async (req, res, next) => {
  try {
    const { contract } = req;
    const { product } = req.query;

    if (contract.diamond) {
      const offers = await Offer.find({
        contract: contract._id,
        product,
      }).distinct('diamondRangeIndex');

      if (_.isEmpty(offers)) {
        return next(new AppError('Offers not found.', 404));
      }

      req.offers = offers;
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
