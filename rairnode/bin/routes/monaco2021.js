const express = require('express');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

module.exports = context => {
  const router = express.Router();

  // Get full data about particular product and get list of tokens for it
  router.get('/:contractId/:productIndex', async (req, res, next) => {
    try {
      const { contractId, productIndex } = req.params;
      const productInd = Number(productIndex);
      let tokens = [];
      let totalCount = 0;

      const [contract] = await context.db.Contract.aggregate([
        { $match: { _id: ObjectId(contractId) } },
        {
          $lookup: {
            from: 'Product',
            let: {
              contr: '$_id',
              productInd
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contr'
                        ]
                      },
                      {
                        $eq: [
                          '$collectionIndexInContract',
                          '$$productInd'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'products'
          }
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$_id',
              prod: '$products.collectionIndexInContract'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contr'
                        ]
                      },
                      {
                        $eq: [
                          '$product',
                          '$$prod'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'offerPools'
          }
        },
        { $unwind: '$offerPools' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              contr: '$_id',
              productIndex: '$products.collectionIndexInContract',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contr'
                        ]
                      },
                      {
                        $eq: [
                          '$product',
                          '$$productIndex'
                        ]
                      },
                    ]
                  }
                }
              }
            ],
            as: 'products.offers'
          }
        }
      ]);

      if (_.isEmpty(contract)) {
        return res.status(404).send({ success: false, message: 'Product or contract not found.' });
      }

      if (contract.diamond) {
        const offers = await context.db.Offer.find({ contract: contract._id, product: productInd }).distinct('offerIndex');

        tokens = await context.db.MintedToken.find({
          contract: contract._id,
          offer: { $in: offers }
        });
        totalCount = await context.db.MintedToken.countDocuments({
          contract: contract._id,
          offer: { $in: offers }
        });
      } else {
        tokens = await context.db.MintedToken.find({
          contract: contract._id,
          offerPool: contract.offerPools.marketplaceCatalogIndex
        });
        totalCount = await context.db.MintedToken.countDocuments({
          contract: contract._id,
          offerPool: contract.offerPools.marketplaceCatalogIndex
        });
      }

      if (_.isEmpty(tokens)) {
        return res.status(404).send({ success: false, message: 'Tokens not found.' });
      }

      res.json({ success: true, result: { contract: _.omit(contract, ['offerPools']), tokens, totalCount } });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
