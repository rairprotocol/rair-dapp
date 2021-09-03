const express = require('express');
const { validation, JWTVerification } = require('../middleware');
const upload = require('../Multer/Config.js');
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');

module.exports = context => {
  const router = express.Router();

  router.post('/', /*JWTVerification(context),*/ upload.single('csv'), async (req, res, next) => {
    try {
      const { contract, product } = req.body;
      const prod = parseInt(product);
      const records = [];
      const forSave = [];

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

      await new Promise((resolve, reject) => fs.createReadStream(`${ req.file.destination }${ req.file.filename }`)
        .pipe(csv())
        .on('data', data => records.push(data))
        .on('end', () => {
          console.log(records);

          _.forEach(offerPools, offerPool => {
            _.forEach(records, record => {
              if (_.inRange(record.NFTID, offerPool.offer.range[0], (offerPool.offer.range[1] + 1))) {
                const attributes = _.chain(record)
                  .assign({})
                  .omit(['NFTID', 'transferto address', 'name', 'description', 'image'])
                  .value();

                forSave.push({
                  token: record.NFTID,
                  ownerAddress: record['transferto address'],
                  offerPool: offerPool.marketplaceCatalogIndex,
                  offer: offerPool.offer.offerIndex,
                  contract,
                  metadata: {
                    name: record.name,
                    description: record.description,
                    // artist: { type: String },
                    // external_url: { type: String, required: true },
                    image: record.image,
                    attributes: JSON.stringify(attributes)
                  }
                });
              }
            });

            return resolve(records);
          });
        })
        .on('error', reject)
      );

      const result = await context.db.MintedToken.insertMany(forSave);

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  router.get('/files/:contract/:token/:product', validation('getFilesByNFT', 'params'), async (req, res, next) => {
    try {
      const { contract, token, product } = req.params;

      const prod = parseInt(product);

      const offerPool = (await context.db.OfferPool.findOne({ contract, product: prod })).toObject();

      const files = await context.db.MintedToken.aggregate([
        { $match: { contract, offerPool: offerPool.marketplaceCatalogIndex, token } },
        {
          $lookup: {
            from: 'File',
            let: {
              contractT: '$contract',
              offerIndex: '$offer',
              productT: prod
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contractT'
                        ]
                      },
                      {
                        $eq: [
                          '$product',
                          '$$productT'
                        ]
                      },
                      {
                        $in: [
                          '$$offerIndex',
                          '$offer'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'files'
          },
        },
        { $unwind: '$files' },
        { $replaceRoot: { newRoot: '$files' } },
      ]);

      res.json({ success: true, files });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
