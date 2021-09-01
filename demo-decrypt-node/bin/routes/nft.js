const express = require('express');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router()

  router.get('/files/:contract/:token/:offerPool', validation('getFilesByNFT', 'params'), async (req, res, next) => {
    try {
      const { contract, token, offerPool } = req.params;

      const offerP = parseInt(offerPool);

      const files = await context.db.MintedToken.aggregate([
        { $match: { contract, offerPool: offerP, token } },
        {
          $lookup: {
            from: "Offer",
            let: {
              offerI: '$offer',
              offerP: '$offerPool'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$offerIndex",
                          "$$offerI"
                        ]
                      },
                      {
                        $eq: [
                          "$offerPool",
                          "$$offerP"
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "offers"
          }
        },
        { $unwind: '$offers' },
        {
          $lookup: {
            from: "File",
            let: {
              contractT: "$contract",
              offerIndex: '$offer',
              productT: '$offers.product'
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
