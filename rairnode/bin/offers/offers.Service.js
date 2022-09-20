const _ = require('lodash');
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
        return res
          .status(404)
          .send({ success: false, message: 'Offers not found.' });
      }

      req.offers = offers;
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
