const AppError = require('../../utils/errors/AppError');
const APIFeatures = require('../../utils/apiFeatures');
const { Product: ProductModel, Contract } = require('../../models');

const eFactory = require('../../utils/entityFactory');
const { addFile } = require('../../integrations/ipfsService')();

exports.getAllProducts = eFactory.getAll(ProductModel);
exports.getProductById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.json({ success: true, product });
  } catch (e) {
    next(e);
  }
};

exports.setProductBanner = async (req, res, next) => {
  try {
    if (!req.file || !req.file.mimetype.includes('image')) {
      return next(new AppError('No image loaded'));
    }
    const { id } = req.params;
    const foundProduct = await ProductModel.findById(id);
    if (!foundProduct) {
      return next(new AppError('Invalid Product ID'));
    }
    const ipfsHash = await addFile(req.file.destination, req.file.filename);
    if (!ipfsHash) {
      return res.json({
        success: false,
        message: 'Error uploading file',
      });
    }
    foundProduct.bannerImage = `https://ipfs.io/ipfs/${ipfsHash}`;
    foundProduct.save();
    return res.json({
      success: true,
      bannerURL: foundProduct.bannerImage,
    });
  } catch (error) {
    return next(new AppError(error));
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
