const fs = require('fs');
const log = require('../../utils/logger')(module);
const { File, User, MediaViewLog, Unlock, ServerSetting } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const { checkBalanceAny, checkBalanceProduct, checkAdminTokenOwns } = require('../../integrations/ethers/tokenValidation');
const { superAdminInstance } = require('../../utils/vaultSuperAdmin');
const { emitEvent } = require('../../integrations/socket.io');

module.exports = {
  generateChallengeMessage: async (req, res, next) => {
    const messages = {
      login: `Login to ${process.env.APP_NAME}. This sign request securely logs you in and will not trigger a blockchain transaction or cost any gas fees.`,
    };
    if (req?.body?.mediaId) {
      const fileData = await File.findById(req.body.mediaId);
      if (fileData.ageRestricted && !req.session.userData.ageVerified) {
        return next(new AppError('Age verification required', 400));
      }
      const authorData = await User.findOne({
        publicAddress: fileData?.uploader,
      });
      messages.decrypt = `Complete this signature request to unlock media: ${fileData?.title} by ${authorData?.nickName ? authorData?.nickName : fileData?.uploader}`;
    }
    if (req.body.zoomId) {
      let zoomData;
      if (req.body.zoomId === 'Kohler') {
        zoomData = {
          title: 'Tax Hacks Summit',
          user: 'Mark Kohler',
        };
      } else {
        return next(new AppError('Invalid meeting ID', 400));
      }
      /* const fileData = await File.findById(req.body.mediaId);
      const authorData = await User.findOne({
        publicAddress: fileData?.uploader,
      }); */
      messages.decrypt = `Complete this signature request to unlock the meeting: ${zoomData.title} by ${zoomData.user}`;
    }
    req.metaAuth = {
      customDescription: messages[req.body.intent],
    };
    return next();
  },
  identifyCurrentLoggedUser: async (req, res, next) => {
    if (req.session && req.session.userData) {
      // eslint-disable-next-line no-unused-vars
      const { _id, adminNFT, ...publicFacingUserData } = req.session.userData;
      return res.json({ success: true, user: publicFacingUserData });
    }
    return res.json({ success: false });
  },
  logoutWithSession: async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.send({ success: true });
    });
  },
  // Initializes the session information
  loginFromSignature: async (req, res, next) => {
    const ethAddress = req?.metaAuth?.recovered;
    if (ethAddress) {
      const userData = await User.findOne({
        publicAddress: ethAddress.toLowerCase(),
      }, '-creationDate -nonce').lean();
      if (userData === null) {
        return next(new AppError('User not found.', 404));
      }

      try {
        // Check OFAC blocklist
        // Read the file content
        const content = fs.readFileSync(
          './bin/integrations/ofac/sanctioned_addresses_ETH.json',
          'utf8',
        );
        const ofacBlocklist = JSON.parse(content).map((address) => address.toLowerCase());
        if (ofacBlocklist.includes(ethAddress)) {
          await User.findByIdAndUpdate(userData._id, { $set: { blocked: true } });
          userData.blocked = true;
        }
      } catch (error) {
        log.error('Cannot read OFAC list');
      }
      if (userData.blocked) {
        log.error(`Blocked user tried to login: ${ethAddress}`);
        return next(new AppError('Authentication failed.', 403));
      }

      // Uncomment to enable NFT check on login
      // userData.adminRights = await checkAdminTokenOwns(userData.publicAddress);
      const { superAdmins, superAdminsOnVault, signupMessage } = await ServerSetting.findOne({});
      const socket = req.app.get('socket');
      emitEvent(socket)(
        userData.publicAddress,
        'message',
        signupMessage,
        [],
      );
      userData.superAdmin = superAdminsOnVault
        ? await superAdminInstance.hasSuperAdminRights(userData.publicAddress)
        : superAdmins.includes(userData.publicAddress);
      userData.oreId = req?.metaAuth?.oreId;

      // Delete this line to restore NFT check on login
      userData.adminRights = userData.superAdmin;

      req.session.userData = { ...userData, loginType: req.web3LoginMethod };

      // eslint-disable-next-line no-unused-vars
      const { _id, adminNFT, ...publicFacingUserData } = userData;
      return res.json({ success: true, user: publicFacingUserData });
    }
    return next(new AppError('Authentication failed', 403));
  },

  unlockMediaWithSession: async (req, res, next) => {
    const { type, fileId } = req.body;
    const { userData } = req.session;
    if (!userData) {
      return res.json({
        success: false,
        message: 'Login required',
      });
    }
    if (type === 'file') {
      const media = await File.findOne({ _id: fileId });
      if (media.ageRestricted && !userData?.ageVerified) {
        return next(new AppError('Age verification required', 403));
      }
      const unlocks = await Unlock.aggregate([
        {
          $match: {
            file: fileId,
          },
        }, {
          $lookup: {
            from: 'File',
            localField: 'file',
            foreignField: '_id',
            as: 'file',
          },
        }, {
          $lookup: {
            from: 'Offer',
            localField: 'offers',
            foreignField: '_id',
            as: 'offers',
          },
        }, {
          $lookup: {
            from: 'Contract',
            localField: 'offers.contract',
            foreignField: '_id',
            as: 'contractData',
          },
        },
      ]);

      const offerData = unlocks[0]?.offers?.map((item) => item);
      const contractData = unlocks[0]?.contractData?.map((item) => item);

      if (!offerData && !media.demo) {
        return next(new AppError('No data found for file', 403));
      }

      let ownsMediaNFT = false;
      let unlockingOffer;

      try {
        if (media.demo) {
          ownsMediaNFT = true;
          log.info(`Media ${fileId} is flagged as demo, will not validate NFT ownership`);
        } else if (media.uploader === userData.publicAddress) {
          ownsMediaNFT = true;
          log.info(`Media ${fileId} unlocked by uploader ${userData.publicAddress}`);
        } else if (offerData) {
          const contractMapping = {};
          contractData.forEach((contract) => {
            contractMapping[contract._id] = contract;
          });
          if (await checkAdminTokenOwns(userData.publicAddress)) {
            ownsMediaNFT = true;
            log.info(`User address ${
              userData.publicAddress
            } unlocked media ${fileId} with admin privileges`);
          }
          if (!ownsMediaNFT) {
            // eslint-disable-next-line no-restricted-syntax
            for await (const offer of offerData) {
              const contract = contractMapping[offer.contract];
              if (contract.external) {
                ownsMediaNFT = await checkBalanceAny(
                  userData.publicAddress,
                  contract.blockchain,
                  contract.contractAddress,
                );
              } else {
                ownsMediaNFT = await checkBalanceProduct(
                  userData.publicAddress,
                  contract.blockchain,
                  contract.contractAddress,
                  offer.product,
                  offer.range[0],
                  offer.range[1],
                );
              }
              if (ownsMediaNFT) {
                unlockingOffer = offer._id;
                log.info(`User ${userData.publicAddress} unlocked ${fileId} with offer ${offer._id}: ${offer.offerName} in ${contract.blockchain}`);
                break;
              }
            }
          }
        }
      } catch (e) {
        return next(new AppError(`Could not verify account: ${e}`, 403));
      }

      if (!ownsMediaNFT) {
        return next(new AppError('Unauthorized', 403));
      }
      req.session.authorizedMediaStream = fileId;
      req.session.authorizedMediaType = type;
      const viewData = new MediaViewLog({
        userAddress: userData.publicAddress,
        file: fileId,
        decryptedFiles: 0,
        offer: unlockingOffer,
      });
      if (type === 'file') {
        await viewData.save();
        if (!media.views) {
          media.views = 0;
        }
        media.views += 1;
        await media.save();
        req.session.viewLogId = viewData._id;
      }
      return res.json({ success: true });
    }
    return res.json({ success: false });
  },
};
