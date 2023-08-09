const jwt = require('jsonwebtoken');
const axios = require('axios');
// const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const { OreId } = require('oreid-js');
const log = require('../utils/logger')(module);
const { File, User, MediaViewLog, Unlock } = require('../models');
const AppError = require('../utils/errors/AppError');
const { zoomSecret, zoomClientID } = require('../config');
const { checkBalanceAny, checkBalanceProduct, checkAdminTokenOwns } = require('../integrations/ethers/tokenValidation');
const { superAdminInstance } = require('../utils/vaultSuperAdmin');

module.exports = {
  oreIdIdentifier: async (req, res, next) => {
    const { idToken } = req.body;
    const oreId = new OreId({
        appId: process.env.ORE_ID_APPID,
        apiKey: process.env.ORE_ID_APIKEY,
        appName: 'RAIR',
    });
    await oreId.init();
    await oreId.auth.loginWithToken({
        idToken,
    });
    await oreId.auth.user.getData();
    const userAccount = oreId.auth.user.data.chainAccounts.find(
      (account) => account.chainNetwork.includes('eth'),
    );
    if (!userAccount) {
      next(new AppError('No accounts found'));
    }
    req.metaAuth = {
      recovered: userAccount.chainAccount,
      oreId: idToken,
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
      const userData = await User.findOne({ publicAddress: ethAddress }, '-creationDate -nonce').lean();
      if (userData === null) {
        return next(new AppError('User not found.', 404));
      }
      userData.adminRights = await checkAdminTokenOwns(userData.publicAddress);
      userData.superAdmin = await superAdminInstance
        .hasSuperAdminRights(userData.publicAddress);
      userData.oreId = req?.metaAuth?.oreId;
      req.session.userData = userData;

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
  authToZoom: async (req, res, next) => {
    try {
      // JWT creation will be deprecated on June 2023
      const payload = {
        iss: zoomClientID,
        exp: new Date().getTime() + 5000,
      };
      const token = jwt.sign(payload, zoomSecret);
      // ... replace with Oauth

      // Do not use findOne - this will lead to positive result in case mediaID=''
      // To work this requires auth with /get_token/:MetaMessage/:MetaSignature/:mediaId
      // This is the most secure way as user won't be able to change mediaID in request
      // As well this quarantee that user is authorized, as there is a valid session
      const { session } = req;
      if (session.authorizedMediaType !== 'zoom') {
        return next(new AppError('Invalid request', 403));
      }
      const { meetingId } = File.findById(session.authorizedMediaStream);
      // Challenging Zoom for meeting invitation link
      const respond = await axios.get({
        uri: `https://api.zoom.us/v2/meetings/${meetingId}/invitation`,
        auth: {
          bearer: token,
        },
      });
      return res.json(respond);
    } catch (err) {
      log.error(err);
      return next(err);
    }
  },
};
