const fs = require('fs');
const jwt = require('jsonwebtoken');
const log = require('../../utils/logger')(module);
const { File, User, MediaViewLog, Unlock, ServerSetting, UserLinkage } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const { checkBalanceAny, checkBalanceProduct, checkAdminTokenOwns } = require('../../integrations/ethers/tokenValidation');
const { superAdminInstance } = require('../../utils/vaultSuperAdmin');
const { emitEvent } = require('../../integrations/socket.io');

module.exports = {
  generateChallengeMessage: async (req, res, next) => {
    const messages = {
      login: `Login to ${process.env.APP_NAME}. This sign request securely logs you in and will not trigger a blockchain transaction or cost any gas fees.`,
    };
    if (req?.user?.publicAddress && req.body.intent === 'linkAccount') {
      messages.linkAccount = `Complete this signature request to connect with user account ${req.user.publicAddress}`;
    }
    if (req?.body?.mediaId) {
      const fileData = await File.findById(req.body.mediaId);
      if (fileData.ageRestricted && !req.user.ageVerified) {
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
    if (req?.body?.intent === 'login') {
      req?.session?.destroy();
    }
    req.metaAuth = {
      customDescription: messages[req.body.intent],
    };
    return next();
  },
  identifyCurrentLoggedUser: async (req, res, next) => {
    if (req.user) {
      // eslint-disable-next-line no-unused-vars
      const { _id, adminNFT, ...publicFacingUserData } = req.user;
      return res.json({ success: true, user: publicFacingUserData });
    }
    return res.json({ success: false });
  },
  logoutWithSession: async (req, res, next) => {
    req?.session?.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.send({ success: true });
    });
  },
  // Initializes the session information
  loginFromSignature: async (req, res, next) => {
    try {
      const ethAddress = req?.metaAuth?.recovered;
      if (ethAddress) {
        const userData = await User.findOne({
          publicAddress: ethAddress.toLowerCase(),
        }, '-creationDate -nonce').lean();
        if (userData === null) {
          return next(new AppError('User not found.', 404));
        }

        if (!userData.loginType) {
          userData.loginType = req.web3LoginMethod;
          await User.findByIdAndUpdate(userData._id, {
            $set: { loginType: req.web3LoginMethod },
          });
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
        const { superAdmins, superAdminsOnVault } = await ServerSetting.findOne({});

        const socket = req.app.get('socket');

        if (
          req?.user?._id &&
          userData.publicAddress !== req.user._id
        ) {
          let linkage = await UserLinkage.findOne({
            accounts: {
              $in: [
                userData._id,
                req.user._id,
              ],
            },
          });

          if (!linkage) {
            linkage = await UserLinkage.create({
              accounts: [
                userData._id,
                req.user._id,
              ],
            });
          }

          emitEvent(socket)(
            userData.publicAddress,
            'message',
            `Linked accounts: ${
              userData.publicAddress ||
              ''
            } and ${req.user.publicAddress}`,
            [],
          );
          return res.json({ success: true });
        }
        emitEvent(socket)(
          userData.publicAddress,
          'message',
          `Welcome back ${
            userData.nickName ||
            ''
          }${
            userData.lastLogin
              ? `, last login: ${userData.lastLogin}`
              : ''}`,
          [],
        );
        userData.superAdmin = superAdminsOnVault
          ? await superAdminInstance.hasSuperAdminRights(userData.publicAddress)
          : superAdmins.includes(userData.publicAddress);
        userData.oreId = req?.metaAuth?.oreId;

        // Delete this line to restore NFT check on login
        userData.adminRights = userData.superAdmin;

        req.session.userData = { ...userData, loginType: req.web3LoginMethod };
        const token = jwt.sign({
          address: userData.publicAddress,
          id: userData._id,
          gitHandle: userData.gitHandle,
          superAdmin: userData.superAdmin,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // eslint-disable-next-line no-unused-vars
        const { _id, adminNFT, ...publicFacingUserData } = userData;

        await User.findByIdAndUpdate(
          userData._id,
          {
            $set: {
              lastLogin: new Date().toString(),
            },
          },
        );
        return res.json({ success: true, user: publicFacingUserData, token });
      }
      return next(new AppError('Authentication failed', 403));
    } catch (err) {
      return next(new AppError(err, 500));
    }
  },

  unlockMediaWithSession: async (req, res, next) => {
    const { type, fileId } = req.body;
    const { userData } = req.session;
    const media = await File.findOne({ _id: fileId });
    if (!media.demo && !userData) {
      return res.json({
        success: false,
        message: 'Login required',
      });
    }
    if (type === 'file') {
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
        } else if (media.uploader === userData?.publicAddress) {
          ownsMediaNFT = true;
          log.info(`Media ${fileId} unlocked by uploader ${userData?.publicAddress}`);
        } else if (offerData) {
          const contractMapping = {};
          contractData.forEach((contract) => {
            contractMapping[contract._id] = contract;
          });
          if (await checkAdminTokenOwns(userData.publicAddress)) {
            ownsMediaNFT = true;
            log.info(`User address ${
              userData?.publicAddress
            } unlocked media ${fileId} with admin privileges`);
          }
          if (!ownsMediaNFT) {
            // eslint-disable-next-line no-restricted-syntax
            for await (const offer of offerData) {
              const contract = contractMapping[offer.contract];
              if (contract.external) {
                ownsMediaNFT = await checkBalanceAny(
                  userData?.publicAddress,
                  contract.blockchain,
                  contract.contractAddress,
                );
              } else {
                ownsMediaNFT = await checkBalanceProduct(
                  userData?.publicAddress,
                  contract.blockchain,
                  contract.contractAddress,
                  offer.product,
                  offer.range[0],
                  offer.range[1],
                );
              }
              if (ownsMediaNFT) {
                unlockingOffer = offer._id;
                log.info(`User ${userData?.publicAddress} unlocked ${fileId} with offer ${offer._id}: ${offer.offerName} in ${contract.blockchain}`);
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
        userAddress: userData?.publicAddress || 'Unlogged user',
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
