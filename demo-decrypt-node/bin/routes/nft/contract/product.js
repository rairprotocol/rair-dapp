const express = require('express');
const { validation, JWTVerification } = require('../../../middleware');

module.exports = context => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { contract, product } = req;
      const prod = parseInt(product);

      const result = await context.db.OfferPool.aggregate([
        { $match: { contract, product: prod } },
        {
          $lookup: {
            from: "MintedToken",
            let: {
              contractOP: '$contract',
              offerPoolIndex: '$marketplaceCatalogIndex'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$contract",
                          "$$contractOP"
                        ]
                      },
                      {
                        $eq: [
                          "$offerPool",
                          "$$offerPoolIndex"
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "mintedTokens"
          }
        },
        { $unwind: '$mintedTokens' },
        { $replaceRoot: { newRoot: '$mintedTokens' } },
      ]);

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  router.get('/files/:token', async (req, res, next) => {
    try {
      const { token } = req.params;
      const { contract, product } = req;

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
