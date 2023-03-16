const jwt = require('jsonwebtoken');
const axios = require('axios');
// const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const log = require('../utils/logger')(module);
const { File, User, Contract, Offer, MediaViewLog } = require('../models');
const AppError = require('../utils/errors/AppError');
const { zoomSecret, zoomClientID } = require('../config');
const { checkBalanceAny, checkBalanceProduct, checkAdminTokenOwns } = require('../integrations/ethers/tokenValidation');
const { superAdminInstance } = require('../utils/vaultSuperAdmin');

module.exports = {
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
      const contract = await Contract.findOne(media.contract);
      if (!contract) {
        return next(new AppError('No contract found', 400));
      }

      const offerQuery = {
        contract: media.contract,
      };
      if (contract.diamond) {
        offerQuery.diamondRangeIndex = { $in: media.offer };
      } else {
        offerQuery.offerIndex = { $in: media.offer };
      }
      const offers = await Offer.find(offerQuery);

      let ownsMediaNFT = false;

      // Don't bother if the file is marked as a demo
      if (!media.demo) {
        // Verify the user has the tokens needed in a RAIR contract
        // eslint-disable-next-line no-restricted-syntax
        for await (const offer of offers) {
          const result = contract.external
            ? await checkBalanceAny(
              userData.publicAddress,
              contract.blockchain,
              contract.contractAddress,
            )
            : await checkBalanceProduct(
              userData.publicAddress,
              contract.blockchain,
              contract.contractAddress,
              offer.product,
              offer.range[0],
              offer.range[1],
            );
          if (result) {
            ownsMediaNFT = true;
            break;
          }
        }
        // verify the account holds the required admin NFT
        if (
          !ownsMediaNFT &&
          media.authorPublicAddress === userData.publicAddress
        ) {
          try {
            ownsMediaNFT = await checkAdminTokenOwns(userData.publicAddress);
            if (ownsMediaNFT) {
              log.info(`User address ${userData.publicAddress} unlocked media ${fileId} with admin privileges`);
            }
          } catch (e) {
            return next(new AppError(`Could not verify account: ${e}`, 403));
          }
        }
      } else {
        log.info(`Media ${fileId} is flagged as demo, will not validate NFT ownership`);
      }

      if (
        !ownsMediaNFT &&
        !media.demo
      ) {
        return next(new AppError('Unauthorized', 403));
      }

      req.session.authorizedMediaStream = fileId;
      req.session.authorizedMediaType = type;

      const viewData = new MediaViewLog({
        userAddress: userData.publicAddress,
        file: fileId,
        timeWatched: 0,
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
