const express = require('express');
const { JWTVerification, validation } = require('../../middleware');
const upload = require('../../Multer/Config.js');
const log = require('../../utils/logger')(module);
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { execPromise } = require('../../utils/helpers');

const removeTempFile = async (roadToFile) => {
  const command = `rm ${ roadToFile }`;
  await execPromise(command);
};

module.exports = context => {
  const router = express.Router();

  // Create bunch of lazy minted tokens from csv file
  router.post('/', JWTVerification(context), upload.single('csv'), async (req, res, next) => {
    try {
      const { contract, product } = req.body;
      const { user } = req;
      const prod = Number(product);
      const defaultFields = ['nftid', 'publicaddress', 'name', 'description', 'artist'];
      const optionalFields = ['image', 'animation_url'];
      const roadToFile = `${ req.file.destination }${ req.file.filename }`;
      const records = [];
      const forSave = [];
      const tokens = [];

      if (!user.adminRights) {
        return res.status(403).send({ success: false, message: 'Not have admin rights.' });
      }

      const foundContract = await context.db.Contract.findById(contract);

      if (_.isEmpty(foundContract)) {
        return res.status(404).send({ success: false, message: 'Contract not found.' });
      }

      if (user.publicAddress !== foundContract.user) {
        return res.status(403).send({ success: false, message: 'This contract not belong to you.' });
      }

      const [, adminToken] = user.adminNFT.split(':');

      const offerPools = await context.db.OfferPool.aggregate([
        { $match: { contract: ObjectId(contract), product: prod } },
        {
          $lookup: {
            from: 'Offer',
            let: {
              contractP: '$contract',
              productP: '$product'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contractP'
                        ]
                      },
                      {
                        $eq: [
                          '$product',
                          '$$productP'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'offer'
          }
        },
        { $unwind: '$offer' }
      ]);

      if (_.isEmpty(offerPools)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Offers not found.' });
      }


      const foundProduct = await context.db.Product.findOne({ contract, collectionIndexInContract: product });

      if (_.isEmpty(foundProduct)) {
        await removeTempFile(roadToFile);
        return res.status(404).send({ success: false, message: 'Product not found.' });
      }

      const foundTokens = await context.db.MintedToken.find({ contract, offerPool: _.head(offerPools).marketplaceCatalogIndex  });

      await new Promise((resolve, reject) => fs.createReadStream(`${ req.file.destination }${ req.file.filename }`)
        .pipe(csv({
          mapHeaders: ({ header, index }) => {
            let h = header.toLowerCase();
            h = h.replace(/\s/g, '');

            if (_.includes(defaultFields, h) || _.includes(optionalFields, h)) {
              return h;
            }

            return header;
          }
        }))
        .on('data', data => {
          const foundFields = _.keys(data);
          let isValid = true;
          let isCoverPresent = false;

          _.forEach(defaultFields, field => {
            if (!_.includes(foundFields, field)) {
              isValid = false;
            }
          });

          _.forEach(optionalFields, field => {
            if (_.includes(foundFields, field)) {
              isCoverPresent = true;
            }
          });

          if (isValid && isCoverPresent) records.push(data);
        })
        .on('end', () => {
          _.forEach(offerPools, offerPool => {
            _.forEach(records, record => {
              const token = Number(record.nftid);

              if (_.inRange(token, offerPool.offer.range[0], (offerPool.offer.range[1] + 1))) {
                const address = !!record.publicaddress ? record.publicaddress : '0xooooooooooooooooooooooooooooooooooo' + token;
                const sanitizedOwnerAddress = address.toLowerCase();
                const attributes = _.chain(record)
                  .assign({})
                  .omit(defaultFields)
                  .reduce((re, v, k) => {
                    re.push({ trait_type: k, value: v });
                    return re;
                  }, [])
                  .value();
                const isExist = !!_.find(foundTokens, t => t.offer === offerPool.offer.offerIndex && t.token === token);

                if (!isExist) {
                  forSave.push({
                    token,
                    ownerAddress: sanitizedOwnerAddress,
                    offerPool: offerPool.marketplaceCatalogIndex,
                    offer: offerPool.offer.offerIndex,
                    contract,
                    uniqueIndexInContract: (foundProduct.firstTokenIndex + token),
                    isMinted: false,
                    metadata: {
                      name: record.name,
                      description: record.description,
                      artist: record.artist,
                      external_url: encodeURI(`https://${ process.env.SERVICE_HOST }/${ adminToken }/${ foundContract.title }/${ foundProduct.name }/${ offerPool.offer.offerName }/${ token }`),
                      image: record.image || '',
                      animation_url: record.animation_url || '',
                      attributes: attributes
                    }
                  });

                  tokens.push(token);
                }
              }
            });

            return resolve(records);
          });

          if (_.isEmpty(offerPools)) return resolve();
        })
        .on('error', reject)
      );

      await removeTempFile(roadToFile);

      if (_.isEmpty(forSave)) {
        return res.json({ success: false, message: 'Don\'t have tokens for creation.' });
      }

      try {
        await context.db.MintedToken.insertMany(forSave, { ordered: false });
      } catch (err) {}

      const result = await context.db.MintedToken.find({
        contract,
        offerPool: offerPools[0].marketplaceCatalogIndex,
        token: { $in: tokens },
        isMinted: false
      });

      res.json({ success: true, result });
    } catch (err) {
      await removeTempFile(`${ req.file.destination }${ req.file.filename }`);
      next(err);
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

  router.use('/network/:networkId/:contract', validation('nftContract', 'params'), async (req, res, next) => {
    const contract = await context.db.Contract.findOne({ contractAddress: req.params.contract.toLowerCase(), blockchain: req.params.networkId });

    if (_.isEmpty(contract)) return res.status(404).send({ success: false, message: 'Contract not found.' });

    req.contract = contract;

    next();
  }, require('./contract')(context));

  return router;
};
