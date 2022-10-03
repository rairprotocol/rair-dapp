const express = require('express');

module.exports = (context) => {
  const router = express.Router();

  // Get specific contract
  router.get('/', async (req, res, next) => {
    try {
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

      let products;

      const commonQuery = [
        { $match: { contract: contract._id } },
        { $sort: { creationDate: -1 } },
      ];

      if (contract?.diamond) {
        products = await context.db.Product.aggregate([
          ...commonQuery,
          // Diamond contracts have no OfferPools, use token locks to find the offers
          {
            $lookup: {
              from: 'LockedTokens',
              let: {
                contr: '$contract',
                prod: '$collectionIndexInContract',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$contract',
                            '$$contr',
                          ],
                        },
                        {
                          $eq: [
                            '$product',
                            '$$prod',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'tokenLock',
            },
          },
          { $unwind: '$tokenLock' },
          {
            $lookup: {
              from: 'Offer',
              let: {
                contr: '$contract',
                prod: '$collectionIndexInContract',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$contract',
                            '$$contr',
                          ],
                        },
                        {
                          $eq: [
                            '$product',
                            '$$prod',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'offers',
            },
          },
        ]);
      } else {
        products = await context.db.Product.aggregate([
          ...commonQuery,
          {
            $lookup: {
              from: 'OfferPool',
              let: {
                contr: '$contract',
                prod: '$collectionIndexInContract',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$contract',
                            '$$contr',
                          ],
                        },
                        {
                          $eq: [
                            '$product',
                            '$$prod',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'offerPool',
            },
          },
          { $unwind: '$offerPool' },
          {
            $lookup: {
              from: 'Offer',
              let: {
                offerPoolL: '$offerPool.marketplaceCatalogIndex',
                contractL: '$contract',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$contract',
                            '$$contractL',
                          ],
                        },
                        {
                          $eq: [
                            '$offerPool',
                            '$$offerPoolL',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'offers',
            },
          },
        ]);
      }

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
