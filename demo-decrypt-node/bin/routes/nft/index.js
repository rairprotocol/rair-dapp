const express = require('express');
const { validation } = require('../../middleware');
const { JWTVerification } = require('../../middleware');
const upload = require('../../Multer/Config.js');
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
const { execPromise } = require('../../utils/helpers');

module.exports = context => {
  const router = express.Router()

  // Create bunch of lazy minted tokens from csv file
  router.post('/', JWTVerification(context), upload.single('csv'), async (req, res, next) => {
    try {
      const { contract, product } = req.body;
      const prod = parseInt(product);
      const defaultFields = ['NFTID', 'owneraddress', 'name', 'description', 'image'];
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

      const foundProduct = await context.db.Product.findOne({ contract, collectionIndexInContract: product });

      await new Promise((resolve, reject) => fs.createReadStream(`${ req.file.destination }${ req.file.filename }`)
        .pipe(csv())
        .on('data', data => {
          const foundFields = _.keys(data);
          let isValid = true;

          _.forEach(defaultFields, field => {
            if (!_.includes(foundFields, field)) {
              isValid = false;
            }
          })

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
              }
            });

            return resolve(records);
          });
        })
        .on('error', reject)
      );

      try {
        await context.db.MintedToken.insertMany(forSave, { ordered: false });
      } catch (err) {
        log.error(err);
      }

      const result = await context.db.MintedToken.find({ contract, offerPool: offerPools[0].marketplaceCatalogIndex });

      const command = `rm ${ req.file.destination }${ req.file.filename }`;
      await execPromise(command);

      res.json({ success: true, result });

    } catch (err) {
      next(err);
    }
  });

  router.use('/:contract', (req, res, next) => {
    req.contract = req.params.contract;
    next();
  }, require('./contract')(context));

  return router;
}
