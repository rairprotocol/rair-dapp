const { ServerSetting, Product, Contract, User } = require('../../models');
const AppError = require('../../utils/errors/AppError');

exports.createSettingsIfTheyDontExist = async (req, res, next) => {
  try {
    const settings = await ServerSetting.findOne();
    if (!settings) {
        const newData = new ServerSetting();
        await newData.save();
    }
    return next();
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.getFeaturedCollection = async (req, res, next) => {
  try {
    const settings = await ServerSetting.findOne({});
    let data = {};
    if (settings.featuredCollection) {
      const collectionData = await Product.findById(settings.featuredCollection);
      if (collectionData) {
        const contractData = await Contract.findById(collectionData.contract);
        if (contractData) {
          const userData = await User.findOne(
            { publicAddress: contractData.user },
            {
              nickName: 1,
              avatar: 1,
              publicAddress: 1,
            },
          );
          data = {
            blockchain: contractData.blockchain,
            contract: contractData.contractAddress,
            product: collectionData.collectionIndexInContract,
            collectionName: collectionData.name,
            collectionBanner: collectionData.bannerImage,
            user: userData,
          };
        }
      }
    }
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.getServerSettings = async (req, res, next) => {
  try {
    const settings = await ServerSetting.findOne({}).lean();
    if (settings.featuredCollection) {
      const collectionData = await Product.findById(settings.featuredCollection).lean();
      if (collectionData) {
        const contractData = await Contract.findById(collectionData.contract);
        if (contractData) {
          collectionData.contract = contractData;
        }
        settings.featuredCollection = collectionData;
      }
    }
    return res.json({
      success: true,
      settings,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.setServerSetting = async (req, res, next) => {
  try {
    const { value } = req.body;
    const { setting } = req.params;
    const update = {};
    update[setting] = value;
    await ServerSetting.findOneAndUpdate({}, {
        $set: update,
    });
    return res.json({
        success: true,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};
