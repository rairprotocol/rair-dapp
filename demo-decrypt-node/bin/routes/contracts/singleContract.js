const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { contractAddress } = req;

      const contract = await context.db.Contract.findOne({ contractAddress });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  // router.put('/', validation('singleContract', 'params'), validation('updateContract'), async (req, res, next) => {
  //   try {
  //     const { adminNFT: user } = req.user;
  //     const { contractAddress } = req.params;
  //     const contract = await context.db.Contract.findOneAndUpdate({ user, contractAddress }, { ...req.body }, { new: true });
  //
  //     res.json({ success: true, contract });
  //   } catch (e) {
  //     next(e);
  //   }
  // });

  router.delete('/', async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { contractAddress } = req;

      await context.db.Contract.deleteOne({ contractAddress });

      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.get('/products/offers', async (req, res, next) => {
    try {
      // const { publicAddress: user } = req.user;
      const { contractAddress } = req;

      const products = await context.db.Contract.aggregate([
        { $match: { contractAddress } },
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
