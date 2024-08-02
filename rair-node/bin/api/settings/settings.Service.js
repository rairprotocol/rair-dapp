const { addFile } = require('../../integrations/ipfsService')();
const { ServerSetting, Product, Contract, User, Blockchain, MintedToken, OfferPool, Offer } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const { ipfsGateways } = require('../../config');

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

const ipfsGateway = ipfsGateways[process.env.IPFS_SERVICE];

exports.setAppLogo = async (req, res, next) => {
  try {
    const { target } = req.body;
    const settings = await ServerSetting.findOne({});
    let value;
    if (req.file && req.file.mimetype.includes('image')) {
      const ipfsHash = await addFile(req.file.destination, req.file.filename);
      if (!ipfsHash) {
        return next(new AppError('Unable to upload image at the moment'));
      }
      value = `${ipfsGateway}${ipfsHash}`;
    }
    settings[target] = value;
    await settings.save();
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.getFeaturedCollection = async (req, res, next) => {
  try {
    const settings = await ServerSetting.findOne({});
    let data = {};
    if (settings?.featuredCollection) {
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
    const settings = await ServerSetting.findOne({}, {
      'footerLinks._id': false,
      'customValues._id': false,
    }).lean();
    const blockchainSettings = await Blockchain.find({});
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
      blockchainSettings,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.setServerSetting = async (req, res, next) => {
  try {
    const settings = req.body;
    if (!!settings.superAdmins && !req?.user?.superAdmin) {
      return next(new AppError('Cannot modify super admins'));
    }
    await ServerSetting.findOneAndUpdate({}, {
        $set: settings,
    });
    return res.json({
        success: true,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.setBlockchainSetting = async (req, res, next) => {
  try {
    const { blockchain } = req.params;
    if (!blockchain) {
      return next(new AppError('Invalid Blockchain', 400));
    }
    await Blockchain.findOneAndUpdate({
      hash: blockchain,
    }, { $set: req.body });
    return res.json({ success: true });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.addBlockchainSetting = async (req, res, next) => {
  try {
    const { blockchain } = req.params;
    if (!blockchain) {
      return next(new AppError('Invalid Blockchain', 400));
    }
    await Blockchain.create(req.body);
    return res.json({ success: true });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.deleteBlockchainSetting = async (req, res, next) => {
  try {
    const { blockchain } = req.params;
    if (!blockchain) {
      return next(new AppError('Invalid Blockchain', 400));
    }
    await Blockchain.deleteOne({ hash: blockchain });
    const contracts = (await Contract.find({ blockchain }))
      .map((contract) => contract._id);
    MintedToken.deleteMany({ contract: { $in: contracts } });
    Product.deleteMany({ contract: { $in: contracts } });
    OfferPool.deleteMany({ contract: { $in: contracts } });
    Offer.deleteMany({ contract: { $in: contracts } });
    return res.json({ success: true });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.getTheme = async (req, res, next) => {
  try {
    const {
      darkModePrimary,
      darkModeSecondary,
      darkModeText,
      darkModeBannerLogo,
      darkModeMobileLogo,
      lightModeBannerLogo,
      lightModeMobileLogo,
      buttonPrimaryColor,
      buttonFadeColor,
      buttonSecondaryColor,
    } = await ServerSetting.findOne({}).lean();
    return res.json({
      success: true,
      settings: {
        darkModePrimary,
        darkModeSecondary,
        darkModeText,
        darkModeBannerLogo,
        darkModeMobileLogo,
        lightModeBannerLogo,
        lightModeMobileLogo,
        buttonPrimaryColor,
        buttonFadeColor,
        buttonSecondaryColor,
      },
    });
  } catch (error) {
    return next(new AppError(error));
  }
};
