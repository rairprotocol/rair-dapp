const { exec } = require('child_process');
const _ = require('lodash');
const { checkBalanceSingle, checkBalanceProduct } = require('../integrations/ethers/tokenValidation');
const log = require('./logger')(module);
const { Contract, OfferPool, MintedToken, Offer } = require('../models');

const execPromise = (command, options = {}) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  });
});

const verifyAccessRightsToFile = (user, files) => Promise.all(_.map(files, async (file) => {
  const clonedFile = _.assign({}, file.toObject());
  let ownsTheAdminToken;
  const ownsTheAccessTokens = [];
  let adminNFT = null;
  let isAdminNFTValid = false;

  if (clonedFile.demo) {
    clonedFile.isUnlocked = true;
    return clonedFile;
  }

  if (user) {
    adminNFT = user.adminNFT;
    const reg = /^0x\w{40}:\w+$/;
    isAdminNFTValid = reg.test(adminNFT);
  }

  clonedFile.isUnlocked = (isAdminNFTValid && adminNFT === clonedFile.author);

  // if (!clonedFile.isUnlocked && !!user) { // TODO: use that functionality instead of calling blockchain when resale of tokens functionality will be working and new owner of token will be changing properly
  //   const foundContract = await Contract.findById(file.contract);
  //
  //   let options = {
  //     ownerAddress: user.publicAddress,
  //     contract: foundContract._id,
  //     offer: { $in: file.offer },
  //   };
  //
  //   if (!foundContract.diamond) {
  //     const offerPool = await OfferPool.findOne({
  //       contract: foundContract._id,
  //       product: file.product,
  //     });
  //
  //     if (_.isEmpty(offerPool)) return res.status(404).send({ success: false, message: 'OfferPools not found.' });
  //
  //     options = _.assign(options, { offerPool: offerPool.marketplaceCatalogIndex });
  //   }
  //
  //   const countOfTokens = await MintedToken.countDocuments(options);
  //
  //   if (countOfTokens > 0) clonedFile.isUnlocked = true;
  // }

  if (user) {
    // verify the account holds the required NFT
    if (typeof file.author === 'string' && file.author.length > 0) {
      const [contractAddress, tokenId] = file.author.split(':');
      // Verifying account has token
      try {
        ownsTheAdminToken = await checkBalanceSingle(
          user.publicAddress,
          process.env.ADMIN_NETWORK,
          contractAddress,
          tokenId,
        );
        clonedFile.isUnlocked = ownsTheAdminToken;
      } catch (e) {
        log.error(`Could not verify account: ${e}`);
        clonedFile.isUnlocked = false;
      }
    }

    if (!ownsTheAdminToken) {
      const contract = await Contract.findOne(file.contract);
      const offers = await Offer.find(_.assign(
        { contract: file.contract },
        contract.diamond
          ? { diamondRangeIndex: { $in: file.offer } }
          : { offerIndex: { $in: file.offer } },
      ));

      // verify the user have needed tokens
      for await (const offer of offers) {
        ownsTheAccessTokens.push(await checkBalanceProduct(
          user.publicAddress,
          contract.blockchain,
          contract.contractAddress,
          offer.product,
          offer.range[0],
          offer.range[1],
        ));
        if (ownsTheAccessTokens.includes(true)) {
          clonedFile.isUnlocked = true;
          break;
        }
      }
    }
  }

  return clonedFile;
}));

module.exports = {
  execPromise,
  verifyAccessRightsToFile,
};
