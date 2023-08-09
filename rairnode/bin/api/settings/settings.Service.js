const { ServerSetting } = require('../../models');
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

exports.setMintedTokenResults = async (req, res, next) => {
  try {
    const { value } = req.body;
    await ServerSetting.findOneAndUpdate({}, {
        $set: {
            onlyMintedTokensResult: value,
        },
    });
    return res.json({
        success: true,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.setDemoUploads = async (req, res, next) => {
  try {
    const { value } = req.body;
    await ServerSetting.findOneAndUpdate({}, {
        $set: {
          demoUploadsEnabled: value,
        },
    });
    return res.json({
        success: true,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};
