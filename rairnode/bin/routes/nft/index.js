const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
const path = require('path');
const { nanoid } = require('nanoid');
const { JWTVerification, validation, isAdmin } = require('../../middleware');
const log = require('../../utils/logger')(module);
const upload = require('../../Multer/Config');
const { execPromise } = require('../../utils/helpers');
const contractRoutes = require('./contract');
const { Contract, Product, OfferPool, Offer, MintedToken } = require('../../models');
const { textPurify } = require('../../utils/helpers');
const { addPin, addFolder, addMetadata } = require('../../integrations/ipfsService')();
const config = require('../../config');

const fsPromises = fs.promises;

const removeTempFile = async (roadToFile) => {
  const command = `rm ${roadToFile}`;
  await execPromise(command);
};

module.exports = (context) => {
  const router = express.Router();

  // Create batch of lazy minted tokens from csv file
  router.post('/', JWTVerification, isAdmin, upload.single('csv'), async (req, res, next) => {
    try {
      const { contract, product, updateMeta = 'false' } = req.body;
      const { user } = req;
      const prod = product;
      const defaultFields = ['nftid', 'name', 'description', 'artist'];
      const optionalFields = ['image', 'animation_url', 'publicaddress'];
      const roadToFile = `${req.file.destination}${req.file.filename}`;
      const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
      const records = [];
      const forSave = [];
      const forUpdate = [];
      const tokens = [];
      let foundTokens = [];

      const foundContract = await Contract.findById(contract);

      if (_.isEmpty(foundContract)) {
        return res.status(404).send({ success: false, message: 'Contract not found.' });
      }

      if (user.publicAddress !== foundContract.user) {
        return res.status(403).send({ success: false, message: 'This contract not belong to you.' });
      }

      const offerPool = await OfferPool.findOne({
        contract: foundContract._id,
        product: prod,
      });
      const offers = await Offer.find({ contract: foundContract._id, product: prod });

      if (_.isEmpty(offers)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Offers not found.' });
      }

      const offerIndexes = offers.map((v) => (
        foundContract.diamond ? v.diamondRangeIndex : v.offerIndex
      ));
      const foundProduct = await Product.findOne({
        contract,
        collectionIndexInContract: product,
      });

      if (_.isEmpty(foundProduct)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Product not found.' });
      }

      if (foundContract.diamond) {
        foundTokens = await MintedToken.find({
          contract,
          offer: { $in: offerIndexes },
        });
      } else {
        if (_.isEmpty(offerPool)) {
          await removeTempFile(roadToFile);
          return res.status(404).send({ success: false, message: 'OfferPools not found.' });
        }

        foundTokens = await MintedToken.find({
          contract,
          offerPool: offerPool.marketplaceCatalogIndex,
        });
      }

      await new Promise((resolve, reject) => fs.createReadStream(`${req.file.destination}${req.file.filename}`)
        .pipe(csv({
          mapHeaders: ({ header }) => {
            let h = header.toLowerCase();
            h = h.replace(/\s/g, '');

            if (_.includes(defaultFields, h) || _.includes(optionalFields, h)) {
              return h;
            }

            return header;
          },
        }))
        .on('data', (data) => {
          const foundFields = _.keys(data);
          let isValid = true;
          let isCoverPresent = false;

          _.forEach(defaultFields, (field) => {
            if (!_.includes(foundFields, field)) {
              isValid = false;
            }
          });

          _.forEach(optionalFields, (field) => {
            if (_.includes(foundFields, field)) {
              isCoverPresent = true;
            }
          });

          if (isValid && isCoverPresent) records.push(data);
        })
        .on('end', () => {
          _.forEach(offers, (offer) => {
            _.forEach(records, (record) => {
              const token = record.nftid;

              if (BigInt(token) >= BigInt(offer.range[0]) && BigInt(token) <= BigInt(offer.range[1])) {
                const address = record.publicaddress ? record.publicaddress : `0xooooooooooooooooooooooooooooooooooo${token}`;
                const sanitizedOwnerAddress = address.toLowerCase();
                const attributes = _.chain(record)
                  .assign({})
                  .omit(_.concat(defaultFields, optionalFields))
                  .reduce((re, v, k) => {
                    re.push({ trait_type: k, value: v });
                    return re;
                  }, [])
                  .value();
                const foundToken = _.find(foundTokens, (t) => t.offer === (foundContract.diamond ? offer.diamondRangeIndex : offer.offerIndex) && t.token === token);
                const mainFields = {
                  contract,
                  token,
                };

                if (!foundContract.diamond) {
                  mainFields.offerPool = offerPool.marketplaceCatalogIndex;
                }

                const offerIndex = foundContract.diamond
                  ? offer.diamondRangeIndex
                  : offer.offerIndex;

                const externalURL = encodeURI(`https://${process.env.SERVICE_HOST}/${foundContract._id}/${foundProduct.collectionIndexInContract}/${offerIndex}/${token}`);

                if (!foundToken) {
                  forSave.push({
                    ...mainFields,
                    ownerAddress: sanitizedOwnerAddress,
                    offer: offerIndex,
                    uniqueIndexInContract: (
                      BigInt(foundProduct.firstTokenIndex) + BigInt(token)
                    ).toString(),
                    isMinted: false,
                    metadata: {
                      name: textPurify.sanitize(record.name),
                      description: textPurify.sanitize(record.description),
                      artist: textPurify.sanitize(record.artist),
                      external_url: externalURL,
                      image: record.image || '',
                      animation_url: record.animation_url || '',
                      attributes,
                    },
                  });

                  tokens.push(token);
                }

                if (updateMeta === 'true' && foundToken && !foundToken.isMinted) {
                  forUpdate.push({
                    updateOne: {
                      filter: mainFields,
                      update: {
                        ownerAddress: sanitizedOwnerAddress,
                        metadata: {
                          name: textPurify.sanitize(record.name),
                          description: textPurify.sanitize(record.description),
                          artist: textPurify.sanitize(record.artist),
                          external_url: externalURL,
                          image: record.image || '',
                          animation_url: record.animation_url || '',
                          isMetadataPinned: reg.test(token.metadataURI || ''),
                          attributes,
                        },
                      },
                    },
                  });

                  tokens.push(token);
                }
              }
            });

            return resolve(records);
          });

          if (_.isEmpty(offers)) return resolve();
        })
        .on('error', reject));

      await removeTempFile(roadToFile);

      if (_.isEmpty(forSave) && _.isEmpty(forUpdate)) {
        return res.json({ success: false, message: 'Don\'t have tokens for creation / update.' });
      }

      if (!_.isEmpty(forSave)) {
        try {
          await MintedToken.insertMany(forSave, { ordered: false });
        } catch (err) { log.error(err); }
      }

      if (!_.isEmpty(forUpdate)) {
        try {
          await MintedToken.bulkWrite(forUpdate, { ordered: false });
        } catch (err) { log.error(err); }
      }

      const resultOptions = _.assign({
        contract,
        token: { $in: tokens },
        isMinted: false,
      }, foundContract.diamond
        ? { offer: { $in: offerIndexes } }
        : { offerPool: offerPool.marketplaceCatalogIndex });

      const result = await MintedToken.find(resultOptions);

      res.json({ success: true, result });
    } catch (err) {
      await removeTempFile(`${req.file.destination}${req.file.filename}`);
      return next(err);
    }
  });

  // Get all tokens which belongs to current user
  router.get('/', JWTVerification, async (req, res, next) => {
    try {
      const { publicAddress: ownerAddress } = req.user;
      const result = await MintedToken.find({ ownerAddress });

      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

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
  router.post('/pinningMultiple', JWTVerification, validation('pinningMultiple'), async (req, res, next) => {
    const { contractId, product } = req.body;
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
        return res.status(404).send({ success: false, message: 'Contract not found.' });
      }

      if (user.publicAddress !== contract.user) {
        return res.status(403).send({
          success: false,
          message: 'You have no permissions for uploading metadata.',
        });
      }

      let options = {
        contract: contract._id,
        isMetadataPinned: false,
        'metadata.name': { $nin: ['', 'none'] },
      };

      if (product) {
        foundProduct = await Product.findOne({
          contract: contract._id,
          collectionIndexInContract: product,
        });

        if (_.isEmpty(foundProduct)) return res.status(404).send({ success: false, message: 'Product not found.' });
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
            return res
              .status(404)
              .send({ success: false, message: 'Offers not found.' });
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
            return res
              .status(404)
              .send({ success: false, message: 'OfferPools not found.' });
          }

          options = _.assign(options, {
            offerPool: offerPool.marketplaceCatalogIndex,
          });
        }
      }

      let foundTokens = await MintedToken.find(options);

      if (_.isEmpty(foundTokens)) {
        return res
          .status(400)
          .send({ success: false, message: 'Tokens not found.' });
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

        await Promise.all(_.map(foundTokens, async (item) => {
          await fsPromises.writeFile(`${pathTo}/${folderName}/${item.uniqueIndexInContract}.json`, JSON.stringify(item.metadata, null, 2));
        }));

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
          update: { metadataURI: !singleMetadataFor ? `${storageLink}/${item.uniqueIndexInContract}.json` : 'none', isMetadataPinned: true },
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

      return res.json(!singleMetadataFor ? { success: true } : { success: true, metadataURI });
    } catch (err) {
      // removed the temporary folder
      try {
        await fsPromises.access(`${pathTo}/${folderName}`);
        await fsPromises.rm(`${pathTo}/${folderName}`, { recursive: true });
      } catch (e) {}

      return next(err);
    }
  });

  router.use('/network/:networkId/:contract', validation('nftContract', 'params'), async (req, res, next) => {
    try {
      const contract = await Contract.findOne({
        contractAddress: req.params.contract.toLowerCase(),
        blockchain: req.params.networkId,
      });

      if (_.isEmpty(contract)) return res.status(404).send({ success: false, message: 'Contract not found.' });

      req.contract = contract;

      return next();
    } catch (e) {
      return next(e);
    }
  }, contractRoutes(context));

  return router;
};
