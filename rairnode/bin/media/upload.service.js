const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const {
  Category,
  Contract,
  Offer,
  OfferPool,
  Product,
  File,
} = require('../models/index');

module.exports = {
  validateData: async (req, res, next) => {
    try {
      const { contract, product, offer, category, demo } = req.query;

      const foundContract = await Contract.findById(contract);
      const foundContractId = foundContract._id;

      if (!foundContract) {
        return next(new AppError(`Contract ${contract} not found.`, 404));
      }

      const foundProduct = await Product.findOne({
        contract: foundContractId,
        collectionIndexInContract: product,
      });

      if (!foundProduct) {
        return next(new AppError(`Product ${product} not found.`, 404));
      }

      const foundCategory = await Category.findOne({ name: category });

      if (!foundCategory) {
        return next(new AppError('Category not found.', 404));
      }

      // Diamond contracts have no offerPools

      const foundOfferPool = await OfferPool.findOne({
        contract: foundContractId,
        product: foundProduct.collectionIndexInContract,
      });

      if (demo === 'false') {
        let foundOffers;
        let notExistOffer = '';

        if (foundContract?.diamond) {
          foundOffers = await Offer.find({
            contract: foundContractId,
            diamondRangeIndex: { $in: offer },
          }).distinct('diamondRangeIndex');
        } else {
          foundOffers = await Offer.find({
            contract: foundContractId,
            offerPool: foundOfferPool.marketplaceCatalogIndex,
            offerIndex: { $in: offer },
          }).distinct('offerIndex');
        }

        offer.forEach((item) => {
          if (!_.includes(foundOffers, item)) {
            notExistOffer = item;
          }
        });

        if (notExistOffer) {
          return next(new AppError(`Offer ${notExistOffer} not found.`, 404));
        }

        return res.json({ foundContract, foundCategory });
      }

      return res.json({ foundContract, foundCategory });
    } catch (e) {
      return next(e);
    }
  },

  addFile: async (req, res, next) => {
    try {
      const { cid, meta } = req.body;
      await File.create({
        _id: cid,
        ...meta,
      });

      return res.end();
    } catch (e) {
      return next(e);
    }
  },
};
