const AppError = require('../utils/errors/AppError');
const APIFeatures = require('../utils/apiFeatures');
const { Product: ProductModel, Contract } = require('../models');

const eFactory = require('../utils/entityFactory');

exports.getAllProducts = eFactory.getAll(ProductModel);
exports.getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    res.json({ success: true, product });
  } catch (e) {
    next(e);
  }
};

exports.getProductsByUser = async (req, res, next) => {
  try {
    const contractIds = await Contract.getContractsIdsForUser(
      req.params.userAddress.toLowerCase(),
    );

    if (!contractIds || contractIds.length === 0) {
      throw new AppError(`No contracts exist for the user ${req.params.userAddress}`, 404);
    }

    const features = new APIFeatures(ProductModel.find(), req.query)
      .filter({
        contract: { $in: contractIds },
      })
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query.find();

    if (!products || products.length === 0) {
      throw new AppError(`No products exist for the user ${req.params.userAddress}`, 404);
    }

    res.json({ success: true, products });
  } catch (e) {
    next(e);
  }
};
