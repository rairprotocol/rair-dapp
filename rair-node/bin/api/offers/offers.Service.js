const { ObjectId } = require('mongodb');
const AppError = require('../../utils/errors/AppError');
const { Offer, Contract } = require('../../models');
const eFactory = require('../../utils/entityFactory');

exports.getOfferById = eFactory.getOne(Offer);
exports.getAllOffers = eFactory.getAll(Offer);
exports.validateQueryProduct = eFactory.validateQuery('product');

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

exports.getAvailableTokensInOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await Offer.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'MintedToken',
          let: {
            offerIndex: '$diamondRangeIndex',
            contractId: '$contract',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$$offerIndex', '$offer'] },
                    { $eq: ['$contract', '$$contractId'] },
                    { $eq: ['$isMinted', false] },
                  ],
                },
              },
            },
            {
              $project: {
                token: 1,
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          as: 'availableTokens',
        },
      },
      {
        $project: {
          availableTokens: 1,
        },
      },
    ]);

    return res.json({
      success: true,
      availableTokens: result.availableTokens,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateOfferData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { publicAddress, adminRights } = req.user;
    const { sponsored } = req.body;
    const validationQuery = await Offer.findById(id).populate('contract', 'user', Contract);
    if (
      validationQuery && (
        adminRights ||
        validationQuery.contract.user.toLowerCase() === publicAddress.toLowerCase()
    )) {
      await Offer.findByIdAndUpdate(id, { $set: { sponsored } });
    }
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};
