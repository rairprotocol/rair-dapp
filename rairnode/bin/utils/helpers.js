const { exec } = require('child_process');
const _ = require('lodash');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { promises: fs } = require('fs');
const { checkBalanceProduct, checkAdminTokenOwns } = require('../integrations/ethers/tokenValidation');
const log = require('./logger')(module);
const { Contract, Offer } = require('../models');

const execPromise = (command, options = {}) => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  });
});

const verifyAccessRightsToFile = (files, user) => Promise.all(_.map(files, async (file) => {
  const clonedFile = _.assign({ isUnlocked: false }, file.toObject());
  const ownsTheAccessTokens = [];

  if (clonedFile.demo) {
    clonedFile.isUnlocked = true;
    return clonedFile;
  }

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
    if (user.publicAddress === clonedFile.authorPublicAddress) {
      // Verifying account has token
      try {
        clonedFile.isUnlocked = await checkAdminTokenOwns(user.publicAddress);
      } catch (e) {
        log.error(`Could not verify account: ${e}`);
        clonedFile.isUnlocked = false;
      }
    }

    if (!clonedFile.isUnlocked) {
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

// XSS sanitizer
const textPurify = () => {
  const { window } = new JSDOM('');
  return createDOMPurify(window);
};

// Remove files from temporary server storage
const cleanStorage = async (files) => {
  if (files) {
    const preparedFiles = [].concat(files);
    await Promise.all(
        _.map(preparedFiles, async (file) => {
          await fs.rm(`${file.destination}/${file.filename}`);
          log.info(`File ${file.filename} has removed.`);
        }),
    );
  }
};

const attributesCounter = (tokens = []) => {
  const totalNumber = tokens.length;
  const allAttributesVariants = new Set();
  tokens.forEach((token) => {
    const { metadata } = token;
    const { attributes = [] } = metadata;
    attributes.forEach(attribute => {
      allAttributesVariants.add(JSON.stringify(attribute));
    });
  });

  const allAttributesVariantsArray = Array.from(allAttributesVariants);

  const attributesCounts = allAttributesVariantsArray.reduce((prev, item) => {
    const tokensWithCurrentAttribute = tokens.filter(({ metadata }) => metadata.attributes
    .map(attribute => JSON.stringify(attribute))
    .includes(item));
    return [ ...prev, tokensWithCurrentAttribute.length ];
  }, []);

  return tokens.map((token) => {
    const { metadata } = token;
    metadata.attributes = metadata.attributes.map(attribute => {
      const attributeCountIndex = allAttributesVariantsArray.indexOf(JSON.stringify(attribute));
      const count = attributesCounts[attributeCountIndex];
      const percentage = ((count/totalNumber) * 100).toFixed() + '%'
      return { ...attribute, percentage };
    });
    return {...token, metadata}
  });


};

module.exports = {
  attributesCounter,
  execPromise,
  verifyAccessRightsToFile,
  textPurify: textPurify(),
  cleanStorage,
};
