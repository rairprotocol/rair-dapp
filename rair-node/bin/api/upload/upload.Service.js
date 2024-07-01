const { nanoid } = require('nanoid');
const { ObjectId } = require('mongodb');
const AppError = require('../../utils/errors/AppError');
const {
  Category,
  Offer,
  File,
  Unlock,
  ServerSetting,
  User,
} = require('../../models/index');
const { checkAdminTokenOwns } = require('../../integrations/ethers/tokenValidation');
const { redisClient } = require('../../services/redis');

module.exports = {
  getUploadToken: async (req, res, next) => {
    const { session } = req;
    // If the upload token already exists, keep using it
    if (session.uploadToken) {
      try {
        const userDataOnRedis = await redisClient.get(session.uploadToken);
        if (
          userDataOnRedis &&
          JSON.parse(userDataOnRedis.publicAddress) === session.userData.publicAddress
        ) {
          return res.json({ success: true, secret: session.uploadToken });
        }
      } catch (err) {
        console.info(err);
        return new AppError('Token error, please try again');
      }
    }
    if (session.userData) {
      const secret = nanoid();
      // Tell redis about it
      redisClient.set(secret, JSON.stringify(session.userData));
      // Store current token in case the token is unused
      session.uploadToken = secret;
      // Give it to the frontend
      return res.json({ success: true, secret });
    }
    return res.json({ success: false });
  },
  validateData: async (req, res, next) => {
    try {
      const {
        offers,
        category,
        publicAddress,
        demo,
        demoEndpoint,
      } = req.query;

      if (demoEndpoint === 'true' || demo === 'true') {
        const settings = await ServerSetting.findOne({});
        if (!settings?.demoUploadsEnabled) {
          return next(new AppError('Demo uploads are disabled', 404));
        }
      }

      const foundOffers = await Offer.find({
        _id: { $in: offers.map((offer) => new ObjectId(offer)) },
      }).populate('contract');
      if (foundOffers.length === 0) {
        return next(new AppError('Offers not found', 404));
      }

      const contractOwner = foundOffers?.at(0)?.contract.user;

      const foundUser = await User.findOne({
        publicAddress,
      });
      if (!foundUser) {
        return next(new AppError('User not found', 404));
      }
      if (
        demoEndpoint === false &&
        contractOwner !== publicAddress &&
        !(await checkAdminTokenOwns(publicAddress))
      ) {
        return next(new AppError('Only contract owner is allowed to upload videos', 400));
      }
      // Check that the user hasn't gone over the 3 video limit
      const userFiles = await File.find({
        uploader: publicAddress,
        blockchain: '0x1',
        contractAddress: '0x571acc173f57c095f1f63b28f823f0f33128a6c4'.toLowerCase(),
      });
      if (userFiles.length >= 3) {
        return next(
          new AppError(
            'You have exceeded the file limit of videos for tier of usage. Please remove existing videos to free up space or contact RAIR support to upgrade your subscription.',
            400,
          ),
        );
      }

      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return next(new AppError('Category not found.', 404));
      }

      return res.json({
        ok: true,
        offers: foundOffers.map((offer) => offer._id),
      });
    } catch (e) {
      return next(e);
    }
  },

  addFile: async (req, res, next) => {
    try {
      const { cid, meta } = req.body;

      const {
        mainManifest,
        uploader,
        encryptionType,
        title,
        offers,
        category,
        staticThumbnail,
        animatedThumbnail,
        type,
        extension,
        duration,
        demo,
        totalEncryptedFiles,
        storage,
        storagePath,
        description,
      } = meta;

      await File.create({
        _id: cid,
        demo,
        mainManifest,
        encryptionType,
        title,
        category,
        staticThumbnail,
        animatedThumbnail,
        type,
        extension,
        duration,
        description,
        totalEncryptedFiles,
        storage,
        storagePath,
        uploader,
      });

      const foundOffers = await Offer.find({
        _id: { $in: offers.map((offer) => new ObjectId(offer)) },
      });
      const offerIds = [];

      // eslint-disable-next-line no-restricted-syntax
      for await (const offerData of foundOffers) {
        offerIds.push(offerData._id);
      }

      await Unlock.create({
        file: cid,
        offers: offerIds,
      });

      return res.status(200).json({
        ok: true,
      });
    } catch (e) {
      return next(e);
    }
  },
};
