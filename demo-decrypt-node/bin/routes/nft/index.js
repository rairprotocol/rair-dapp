const express = require('express');
const { validation } = require('../../middleware');
const { JWTVerification } = require('../../middleware');
const upload = require('../../Multer/Config.js');
const log = require('../../utils/logger')(module);
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
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
      const prod = parseInt(product);
      const defaultFields = ['nftid', 'publicaddress', 'name', 'description', 'image', 'artist'];
      const roadToFile = `${ req.file.destination }${ req.file.filename }`;
      const records = [];
      const forSave = [];
      const tokens = [];

      const [foundContract] = await context.db.Contract.aggregate([
        { $match: { contractAddress: contract } },
        { $lookup: { from: 'User', localField: 'user', foreignField: 'publicAddress', as: 'user' } },
        { $unwind: '$user' },
        { $project: { title: 1, 'user.adminNFT': 1 } },
      ]);

      const [contractAddress, adminToken] = foundContract.user.adminNFT.split(':');

      const offerPools = await context.db.OfferPool.aggregate([
        { $match: { contract, product: prod } },
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

      await new Promise((resolve, reject) => fs.createReadStream(`${ req.file.destination }${ req.file.filename }`)
        .pipe(csv({
          mapHeaders: ({ header, index }) => {
            let h = header.toLowerCase();
            h = h.replace(/\s/g, '');

            if (_.includes(defaultFields, h)) {
              return h;
            }

            return header;
          }
        }))
        .on('data', data => {
          const foundFields = _.keys(data);
          let isValid = true;

          _.forEach(defaultFields, field => {
            if (!_.includes(foundFields, field)) {
              isValid = false;
            }
          });

          if (isValid) records.push(data);
        })
        .on('end', () => {
          _.forEach(offerPools, offerPool => {
            _.forEach(records, record => {
              const token = parseInt(record.nftid);

              if (_.inRange(token, offerPool.offer.range[0], (offerPool.offer.range[1] + 1))) {
                const attributes = _.chain(record)
                  .assign({})
                  .omit(defaultFields)
                  .reduce((re, v, k) => {
                    re.push({ trait_type: k, value: v });
                    return re;
                  }, [])
                  .value();

                forSave.push({
                  token,
                  ownerAddress: record.publicaddress,
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
                    image: record.image,
                    attributes: attributes
                  }
                });

                tokens.push(token);
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
        return res.json({ success: false, message: 'Don\'t have tokens for creating.' });
      }

      try {
        await context.db.MintedToken.insertMany(forSave, { ordered: false });
      } catch (err) {
        log.error(err);
      }

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

  router.use('/:contract', (req, res, next) => {
    req.contract = req.params.contract;
    next();
  }, require('./contract')(context));

  return router;
};
