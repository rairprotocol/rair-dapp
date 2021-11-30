const express = require('express');

module.exports = context => {
  const router = express.Router()

  // Get specific contract
  router.get('/', async (req, res, next) => {
    try {
      // // const { adminNFT: user } = req.user;
      // const { contractAddress, blockchain } = req;
      //
      // const contract = await context.db.Contract.findOne({ contractAddress, blockchain });

      res.json({ success: true, contract: req.contract });
    } catch (e) {
      next(e);
    }
  });

  // Find all products for particular contract
  router.get('/products', async (req, res, next) => {
    try {
      const { contract } = req;

      const products = await context.db.Product.find({ contract: contract._id });

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  // Find all products with all offers for each of them for particular contract
  router.get('/products/offers', async (req, res, next) => {
    try {
      const { contract } = req;

      const products = await context.db.Product.aggregate([
        { $match: { contract: contract._id } },
        { $sort: { creationDate: -1 } },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$contract',
              prod: '$collectionIndexInContract'
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
            as: 'offerPool'
          }
        },
        { $unwind: '$offerPool' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              offerPoolL: '$offerPool.marketplaceCatalogIndex',
              contractL: '$contract'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contractL'
                        ]
                      },
                      {
                        $eq: [
                          '$offerPool',
                          '$$offerPoolL'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'offers'
          }
        }
      ]);

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
