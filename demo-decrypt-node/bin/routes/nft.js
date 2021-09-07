const express = require('express');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router()

  router.get('/files/:contract/:token/:product', validation('getFilesByNFT', 'params'), async (req, res, next) => {
    try {
      const { contract, token, product } = req.params;

      const prod = parseInt(product);

      const offerPool = (await context.db.OfferPool.findOne({ contract, product: prod })).toObject();

      const files = await context.db.MintedToken.aggregate([
        { $match: { contract, offerPool: offerPool.marketplaceCatalogIndex, token } },
        {
          $lookup: {
            from: "File",
            let: {
              contractT: "$contract",
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
                          "$contract",
                          "$$contractT"
                        ]
                      },
                      {
                        $eq: [
                          "$product",
                          "$$productT"
                        ]
                      },
                      {
                        $in: [
                          "$$offerIndex",
                          "$offer"
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "files"
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

  return router
}
