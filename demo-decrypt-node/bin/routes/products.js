const express = require('express');

module.exports = context => {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;

      const products = await context.db.Contract.aggregate([
        { $match: { user } },
        { $lookup: { from: 'Product', localField: 'contractAddress', foreignField: 'contract', as: 'products' } },
        { $project: { products: 1, contractAddress: 1 } },
        { $unwind: '$products' },
        { $replaceRoot: { newRoot: '$products' } },
        { $sort: { creationDate: -1 } },
        { $lookup: {
            from: "OfferPool",
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
                          "$contract",
                          "$$contr"
                        ]
                      },
                      {
                        $eq: [
                          "$product",
                          "$$prod"
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "offerPools"
          }
        },
        { $unwind: '$offerPools' },
        { $lookup: { from: 'Offer', localField: 'offerPools.marketplaceCatalogIndex', foreignField: 'offerPool', as: 'offers' } },
        { $project: { offerPools: false } }
      ]);

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  });

  return router
}
