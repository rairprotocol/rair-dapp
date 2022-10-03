const _ = require('lodash');
const AppError = require('../utils/errors/AppError');

const {
  Contract,
  ResaleTokenOffer,
  CustomRoyaltiesSet,
  Offer,
  OfferPool,
  Product,
  MintedToken,
} = require('../models');
const eFactory = require('../utils/entityFactory');
// TODO:: refactor this function
const getOffersAndOfferPools = async (contract, product) => {
  let offerPool = [];

  const offers = await Offer.find({
    contract: contract._id,
    product,
  });

  if (_.isEmpty(offers)) {
    throw new AppError('Offers not found.', 404);
  }

  if (!contract.diamond) {
    offerPool = await OfferPool.findOne({
      contract: contract._id,
      product,
    });

    if (_.isEmpty(offerPool)) {
      throw new AppError('Offerpool not found.', 404);
    }
  }

  return [offers, offerPool];
};

exports.getResaleById = eFactory.getOne(ResaleTokenOffer);
exports.getAllResales = eFactory.getAll(ResaleTokenOffer);
exports.getResaleByExternalId = async (req, res, next) => {
  try {
    // TODO: Add Query string handler and limits. This is not secure
    let tokens = {};
    let filter = {};
    let contractId = '';

    if (req.params.productId) {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return next(new AppError('Product not found.', 404));
      }

      const contract = await Contract.findById(product.contract);
      const offersAndOfferPools = await getOffersAndOfferPools(
        contract,
        product.collectionIndexInContract,
      );
      filter = {
        $or: [
          { offer: { $in: offersAndOfferPools.offers } },
          { offerPool: { $in: offersAndOfferPools.offerPool } },
        ],
      };
      contractId = contract._id;
    }

    if (req.params.offerId) {
      const offer = await Offer.findById(req.params.offerId);

      if (!offer) {
        return next(new AppError('Offer not found.', 404));
      }

      contractId = offer.contract;
      filter = offer.diamond
        ? { offer: offer.diamondRangeIndex }
        : { offer: offer.offerIndex, offerPool: offer.offerPool };
    }
    tokens = await MintedToken.find(filter).distinct('uniqueIndexInContract');
    const resultResaleTokens = await ResaleTokenOffer.find({
      contract: contractId,
      tokenId: { $in: tokens },
    });

    if (!resultResaleTokens || resultResaleTokens.length === 0) {
      return next(new AppError('No resale offers found.', 404));
    }

    return res.json({ success: true, data: resultResaleTokens });
  } catch (err) {
    return next(err);
  }
};

exports.getAllCustomRoyalties = eFactory.getAll(CustomRoyaltiesSet);
exports.createResales = eFactory.createOne(ResaleTokenOffer);
