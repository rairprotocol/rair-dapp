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
      const defaultFields = ['NFTID', 'owneraddress', 'name', 'description', 'image'];
      const roadToFile = `${ req.file.destination }${ req.file.filename }`;
      const records = [];
      const forSave = [];
      const tokens = [];

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
        .pipe(csv())
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
              const token = parseInt(record.NFTID);

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
                  ownerAddress: record['owneraddress'],
                  offerPool: offerPool.marketplaceCatalogIndex,
                  offer: offerPool.offer.offerIndex,
                  contract,
                  uniqueIndexInContract: (foundProduct.firstTokenIndex + token),
                  isMinted: false,
                  metadata: {
                    name: record.name,
                    description: record.description,
                    // artist: { type: String },
                    // external_url: { type: String, required: true },
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

  router.use('/:contract', (req, res, next) => {
    req.contract = req.params.contract;
    next();
  }, require('./contract')(context));

  return router;
};
