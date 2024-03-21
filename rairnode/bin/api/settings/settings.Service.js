const { addFile } = require('../../integrations/ipfsService')();
const { ServerSetting, Product, Contract, User, Blockchain } = require('../../models');
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

const ipfsGateway = {
  filebase: 'https://rair.myfilebase.com/ipfs/',
  pinata: 'https://ipfs.io/ipfs/',
  ipfs: 'https://ipfs.io/ipfs/',
}[process.env.IPFS_SERVICE];

exports.setAppLogo = async (req, res, next) => {
  try {
    const { target } = req.body;
    const settings = await ServerSetting.findOne({});
    let value = undefined;
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
}

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
    const settings = await ServerSetting.findOne({}).lean();
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
    const { display, sync } = req.body;
    if (!blockchain) {
      return res.json({ success: false, message: 'Invalid blockchain' });
    }
    await Blockchain.findOneAndUpdate({
      hash: blockchain,
    }, { $set: { display, sync } });
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
        buttonSecondaryColor
      },
    });
  } catch (error) {
    return next(new AppError(error));
  }
}
