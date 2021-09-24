const express = require('express');
const { validation, JWTVerification } = require('../../../middleware');
const _ = require('lodash');

module.exports = context => {
  const router = express.Router();

  // Get minted tokens fro a product
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

  // Get specific token by internal token ID
  router.get('/token/:token', async (req, res, next) => {
    try {
      const { contract, product } = req;
      const { token } = req.params;
      const prod = parseInt(product);
      const sanitizedToken = parseInt(token);

      const result = await context.db.OfferPool.aggregate([
        { $match: { contract, product: prod } },
        {
          $lookup: {
            from: "MintedToken",
            let: {
              contractOP: '$contract',
              offerPoolIndex: '$marketplaceCatalogIndex',
              tokenRequested: sanitizedToken
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
                      },
                      {
                        $eq: [
                          "$token",
                          "$$tokenRequested"
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

      const re = _.head(result)

      res.json({ success: true, result: re ? re : null });
    } catch (err) {
      next(err);
    }
  });

  // Get list of files locked by token
  router.get('/files/:token', async (req, res, next) => {
    try {
      const { token } = req.params;
      const { contract, product } = req;
      const sanitizedToken = parseInt(token);

      const prod = parseInt(product);

      const offerPoolRaw = await context.db.OfferPool.findOne({ contract, product: prod });

      if (_.isEmpty(offerPoolRaw)) {
        res.json({ success: false, message: 'Offer pool which belong to this particular product not found.' });
        return;
      }

      const offerPool = offerPoolRaw.toObject();

      const files = await context.db.MintedToken.aggregate([
        { $match: { contract, offerPool: offerPool.marketplaceCatalogIndex, token: sanitizedToken } },
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
