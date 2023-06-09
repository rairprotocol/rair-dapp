const express = require('express');
const fs = require('graceful-fs');
const _ = require('lodash');
const path = require('path');
const { nanoid } = require('nanoid');
const AppError = require('../../utils/errors/AppError');
const { validation, isAdmin, requireUserSession } = require('../../middleware');
const log = require('../../utils/logger')(module);
const upload = require('../../Multer/Config');
const contractRoutes = require('./contract');
const { Contract, Product, OfferPool, Offer, MintedToken } = require('../../models');
const { addPin, addFolder, addMetadata } = require('../../integrations/ipfsService')();
const config = require('../../config');
const { createTokensViaCSV } = require('../../api/tokens/tokens.Service');

const fsPromises = fs.promises;

module.exports = (context) => {
  const router = express.Router();

  // Create batch of lazy minted tokens from csv file
  router.post(
    '/',
    requireUserSession,
    isAdmin,
    upload.single('csv'),
    validation(['csvFileUpload'], 'body'),
    createTokensViaCSV,
  );

  // Get all tokens which belongs to current user
  router.get(
    '/',
    requireUserSession,
    async (req, res, next) => {
      try {
        const { publicAddress: ownerAddress } = req.user;
        const result = await MintedToken.find({ ownerAddress });

        res.json({ success: true, result });
      } catch (e) {
        next(e);
      }
    },
  );

  router.get(
    '/:userAddress',
    validation(['pagination'], 'query'),
    validation(['userAddress'], 'params'),
    async (req, res, next) => {
      try {
        const { userAddress } = req.params;

        const { itemsPerPage = 10, pageNum = 1 } = req.query;
        const pageSize = parseInt(itemsPerPage, 10);
        const skip = (parseInt(pageNum, 10) - 1) * pageSize;

        const pipeline = [{
            $lookup: {
                from: 'Contract',
                localField: 'contract',
                foreignField: '_id',
                as: 'contract',
            },
        },
        {
            $unwind: {
                path: '$contract',
            },
        },
        {
            $match: {
                ownerAddress: userAddress,
                'contract.blockView': false,
            },
        }];

        const result = await MintedToken.aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: pageSize },
        ]);

        const count = await MintedToken.aggregate([
          ...pipeline,
          {
            $count: 'totalCount',
          },
        ]);

        res.json({ success: true, result, totalCount: count[0]?.totalCount });
      } catch (e) {
        next(e);
      }
    },
  );

  // Get CSV sample file
  router.get('/csv/sample', async (req, res, next) => {
    try {
      const file = path.join(__dirname, '../../../assets/sample.csv');

      return res.download(file);
    } catch (e) {
      return next(e);
    }
  });

  // Pin batch of metadata to pinata cloud
  router.post('/pinningMultiple', requireUserSession, validation(['pinningMultiple']), async (req, res, next) => {
    const { contractId, product, overwritePin = 'false' } = req.body;
    const { user } = req;
    const folderName = `${Date.now()}-${nanoid()}`;
    const pathTo = `${process.cwd()}/tmp`;
    let foundProduct = {};
    let commonMetadataToken = null;
    let singleMetadataFor = '';
    let metadataURI = '';
    let CID = '';

    try {
      const contract = await Contract.findById(contractId);

      if (_.isEmpty(contract)) {
        return next(new AppError('Contract not found.', 404));
      }

      if (user.publicAddress !== contract.user) {
        return next(new AppError('You have no permissions for uploading metadata.', 403));
      }

      let options = {
        contract: contract._id,
        'metadata.name': { $nin: ['', 'none'] },
      };

      // If we are not overwriting, find all tokens that aren't pinned already
      if (overwritePin !== 'true') {
        options.isMetadataPinned = false;
      }

      if (product) {
        foundProduct = await Product.findOne({
          contract: contract._id,
          collectionIndexInContract: product,
        });

        if (_.isEmpty(foundProduct)) return next(new AppError('Product not found.', 404));
      }

      if (contract.singleMetadata) singleMetadataFor = 'contract';
      if (!_.isEmpty(foundProduct) && foundProduct.singleMetadata) singleMetadataFor = 'product';

      if (singleMetadataFor !== 'contract') {
        if (contract.diamond) {
          const offers = await Offer.find({
            contract: contract._id,
            product,
          }).distinct('diamondRangeIndex');

          if (_.isEmpty(offers)) {
            return next(new AppError('Offers not found.', 404));
          }

          options = _.assign(options, {
            offer: { $in: offers },
          });
        } else {
          const offerPool = await OfferPool.findOne({
            contract: contract._id,
            product,
          });

          if (_.isEmpty(offerPool)) {
            return next(new AppError('OffersPools not found.', 404));
          }

          options = _.assign(options, {
            offerPool: offerPool.marketplaceCatalogIndex,
          });
        }
      }

      let foundTokens = await MintedToken.find(options);

      if (!foundTokens?.length) {
        return next(new AppError(`No tokens found ${overwritePin === true ? '' : ' with unpinned metadata'}`, 400));
      }

      // create a folder with all metadata files for uploading
      if (!singleMetadataFor) {
        // create directory
        try {
          await fsPromises.access(`${pathTo}/${folderName}`);
        } catch (e) {
          log.info(`Create directory ${pathTo}/${folderName}`);
          await fsPromises.mkdir(`${pathTo}/${folderName}`);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const token of foundTokens) {
          // console.info(`Writing file for token #${token.uniqueIndexInContract}`);
          try {
            // If the IPFS gateway exists, replace with an universal prefix
            // This will NOT affect the database, only the JSON files being generated
            token.metadata.image = token.metadata.image.replace(
              'https://ipfs.io/ipfs/',
              'ipfs://',
            );
            fs.writeFileSync(
              `${pathTo}/${folderName}/${token.uniqueIndexInContract}.json`,
              JSON.stringify(token.metadata, null, 2),
            );
          } catch (error) {
            return next(new AppError(`Error writing file for NFT ${token.uniqueIndexInContract}`));
          }
        }

        // upload folder to cloud
        CID = await addFolder(`${pathTo}/${folderName}`, folderName);
        await addPin(CID, `metadata_folder_${folderName}`);
      } else {
        // get source token for the common metadata
        if (singleMetadataFor === 'contract') {
          commonMetadataToken = await MintedToken.findOne({ contract: contract._id, uniqueIndexInContract: '0' });
        } else {
          commonMetadataToken = await MintedToken.findOne({
            contract: contract._id,
            uniqueIndexInContract: foundProduct.firstTokenIndex,
          });
        }

        commonMetadataToken = commonMetadataToken || _.first(foundTokens);

        // store common metadata to cloud
        CID = await addMetadata(commonMetadataToken.metadata, _.get(commonMetadataToken.metadata, 'name', 'none'));
        await addPin(CID, `metadata_${_.get(commonMetadataToken.metadata, 'name', 'none')}`);
      }

      // prepare all data for updating of tokens, contract or product
      const storageLink = _.get(
        {
          ipfs: `${config.ipfs.gateway}/${CID}`,
          pinata: `${config.pinata.gateway}/${CID}`,
        },
        config.ipfsService,
        `${config.pinata.gateway}/${CID}`,
      );

      if (singleMetadataFor) metadataURI = storageLink;

      foundTokens = foundTokens.map((item) => ({
        updateOne: {
          filter: { contract: contract._id, uniqueIndexInContract: item.uniqueIndexInContract },
          update: { metadataURI: !singleMetadataFor ? `${storageLink}/${item.uniqueIndexInContract}.json` : 'none', isMetadataPinned: true, isURIStoredToBlockchain: false },
        },
      }));

      // updating data in DB
      switch (singleMetadataFor) {
        case 'contract':
          await Contract.findByIdAndUpdate(contract._id, { $set: { metadataURI } });
          break;
        case 'product':
          await Product.findByIdAndUpdate(foundProduct._id, { $set: { metadataURI } });
          break;
        default:
          break;
      }

      try {
        await MintedToken.bulkWrite(foundTokens, { ordered: false });
      } catch (err) { log.error(err); }

      // removed the temporary folder
      if (!singleMetadataFor) await fsPromises.rm(`${pathTo}/${folderName}`, { recursive: true });

      if (typeof CID !== 'string') {
        log.error(`Invalid CID detected: ${CID}`);
        CID = '';
      }

      return res.json(!singleMetadataFor ? {
        success: true,
        CID,
        totalCount: foundTokens.length,
      } : { success: true, metadataURI });
    } catch (err) {
      // removed the temporary folder
      try {
        await fsPromises.access(`${pathTo}/${folderName}`);
        await fsPromises.rm(`${pathTo}/${folderName}`, { recursive: true });
      } catch (e) {
        // console.error('There was an error removing files');
      }

      return next(err);
    }
  });

  router.use('/network/:networkId/:contract', validation(['nftContract'], 'params'), async (req, res, next) => {
    try {
      const contract = await Contract.findOne({
        contractAddress: req.params.contract.toLowerCase(),
        blockchain: req.params.networkId,
      });

      if (_.isEmpty(contract)) return next(new AppError('Contract not found.', 404));

      req.contract = contract;

      return next();
    } catch (e) {
      return next(e);
    }
  }, contractRoutes(context));

  return router;
};
