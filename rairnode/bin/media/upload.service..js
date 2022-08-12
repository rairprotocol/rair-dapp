const _ = require('lodash');
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
        return res
          .status(404)
          .send({ success: false, message: `Contract ${contract} not found.` });
      }

      const foundProduct = await Product.findOne({
        contract: foundContractId,
        collectionIndexInContract: product,
      });

      if (!foundProduct) {
        return res
          .status(404)
          .send({ success: false, message: `Product ${product} not found.` });
      }

      const foundCategory = await Category.findOne({ name: category });

      if (!foundCategory) {
        return res
          .status(404)
          .send({ success: false, message: 'Category not found.' });
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
          return res
            .status(404)
            .send({ success: false, message: `Offer ${notExistOffer} not found.` });
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
