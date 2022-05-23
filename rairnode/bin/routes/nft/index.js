const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
const path = require('path');
const { JWTVerification, validation, isAdmin } = require('../../middleware');
const log = require('../../utils/logger')(module);
const upload = require('../../Multer/Config');
const { execPromise } = require('../../utils/helpers');
const contractRoutes = require('./contract');

const removeTempFile = async (roadToFile) => {
  const command = `rm ${roadToFile}`;
  await execPromise(command);
};

module.exports = (context) => {
  const router = express.Router();

  // Create bunch of lazy minted tokens from csv file
  router.post('/', JWTVerification(context), isAdmin, upload.single('csv'), async (req, res, next) => {
    try {
      const { contract, product, updateMeta = 'false' } = req.body;
      const { user } = req;
      const prod = product;
      const defaultFields = ['nftid', 'publicaddress', 'name', 'description', 'artist'];
      const optionalFields = ['image', 'animation_url'];
      const roadToFile = `${req.file.destination}${req.file.filename}`;
      const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
      const records = [];
      const forSave = [];
      const forUpdate = [];
      const tokens = [];
      let foundTokens = [];

      const foundContract = await context.db.Contract.findById(contract);

      if (_.isEmpty(foundContract)) {
        return res.status(404).send({ success: false, message: 'Contract not found.' });
      }

      if (user.publicAddress !== foundContract.user) {
        return res.status(403).send({ success: false, message: 'This contract not belong to you.' });
      }

      const offerPool = await context.db.OfferPool.findOne({
        contract: foundContract._id,
        product: prod,
      });
      const offers = await context.db.Offer.find({ contract: foundContract._id, product: prod });

      if (_.isEmpty(offers)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Offers not found.' });
      }

      const offerIndexes = offers.map((v) => (
        foundContract.diamond ? v.diamondRangeIndex : v.offerIndex
      ));
      const foundProduct = await context.db.Product.findOne({
        contract,
        collectionIndexInContract: product,
      });

      if (_.isEmpty(foundProduct)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Product not found.' });
      }

      if (foundContract.diamond) {
        foundTokens = await context.db.MintedToken.find({
          contract,
          offer: { $in: offerIndexes },
        });
      } else {
        if (_.isEmpty(offerPool)) {
          await removeTempFile(roadToFile);
          return res.status(404).send({ success: false, message: 'OfferPools not found.' });
        }

        foundTokens = await context.db.MintedToken.find({
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

              if ( BigInt(token)>=BigInt(offer.range[0]) && BigInt(token)<=BigInt(offer.range[1])){
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
                    uniqueIndexInContract:  (
                      BigInt(foundProduct.firstTokenIndex) + BigInt(token)
                    ).toString(),
                    isMinted: false,
                    metadata: {
                      name: context.textPurify.sanitize(record.name),
                      description: context.textPurify.sanitize(record.description),
                      artist: context.textPurify.sanitize(record.artist),
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
                          name: context.textPurify.sanitize(record.name),
                          description: context.textPurify.sanitize(record.description),
                          artist: context.textPurify.sanitize(record.artist),
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
          await context.db.MintedToken.insertMany(forSave, { ordered: false });
        } catch (err) { log.error(err); }
      }

      if (!_.isEmpty(forUpdate)) {
        try {
          await context.db.MintedToken.bulkWrite(forUpdate, { ordered: false });
        } catch (err) { log.error(err); }
      }

      const resultOptions = _.assign({
        contract,
        token: { $in: tokens },
        isMinted: false,
      }, foundContract.diamond
        ? { offer: { $in: offerIndexes } }
        : { offerPool: offerPool.marketplaceCatalogIndex });

      const result = await context.db.MintedToken.find(resultOptions);

      res.json({ success: true, result });
    } catch (err) {
      await removeTempFile(`${req.file.destination}${req.file.filename}`);
      return next(err);
    }
  });

  // Get all tokens which belongs to current user
  router.get('/', JWTVerification(context), async (req, res, next) => {
    try {
      const { publicAddress: ownerAddress } = req.user;
      const result = await context.db.MintedToken.find({ ownerAddress });

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

  router.use('/network/:networkId/:contract', validation('nftContract', 'params'), async (req, res, next) => {
    try {
      const contract = await context.db.Contract.findOne({
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
