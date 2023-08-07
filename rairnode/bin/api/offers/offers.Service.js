const AppError = require('../../utils/errors/AppError');
const { Offer } = require('../../models');
const eFactory = require('../../utils/entityFactory');

exports.getOfferById = eFactory.getOne(Offer);
exports.getAllOffers = eFactory.getAll(Offer);
exports.validateQueryProduct = eFactory.validateQuery('product');

exports.getOffersAndLocks = async (req, res, next) => {
  const {
    contract,
    product,
  } = req.query;

  const offers = await Offer.find({
    contract,
    product,
  }).sort('diamondRangeIndex').lean();

  if (!offers.length) {
    return next(new AppError('Offers not found.', 404));
  }

  return res.json({
    success: true,
    offers,
  });
};

exports.getOfferIndexesByContractAndProduct = async (req, res, next) => {
  try {
    const { contract } = req;
    const { product } = req.query;

    if (contract.diamond) {
      const offers = await Offer.find({
        contract: contract._id,
        product,
      }).distinct('diamondRangeIndex');

      if (!offers.length) {
        return next(new AppError('Offers not found.', 404));
      }

      req.offers = offers;
    }

    return next();
  } catch (e) {
    return next(e);
  }
};
