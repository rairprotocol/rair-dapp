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
            from: "Offer",
            let: {
              contr: '$contract',
              proj: '$collectionIndexInContract'
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
                          "$$proj"
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "offers"
          }
        }
      ]);

      res.json({ success: true, products });
    } catch (e) {
      next(e);
    }
  });

  return router
}
