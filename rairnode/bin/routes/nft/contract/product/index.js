const express = require('express');
const _ = require('lodash');
const { validation } = require('../../../../middleware');

module.exports = context => {
  const router = express.Router();

  // Get minted tokens from a product
  router.get('/', validation('getTokensByContractProduct', 'query'), async (req, res, next) => {
    try {
      const { contract, product } = req;
      const { fromToken = 0, toToken = 0, limit = 0 } = req.query;

      const firstToken = Number(fromToken);
      const lastToken = Number(toToken);
      const numberOfTokens = Number(limit);

      let options = {};

      if (contract.diamond) {
        const offers = await context.db.Offer.find({ contract: contract._id, product }).distinct('diamondRangeIndex');

        if (_.isEmpty(offers)) return res.status(404).send({ success: false, message: 'Offers not found.' });

        options = {
          contract: contract._id,
          offer: { $in: offers }
        };
      } else {
        const offerPool = await context.db.OfferPool.findOne({ contract: contract._id, product });

        if (_.isEmpty(offerPool)) return res.status(404).send({ success: false, message: 'OfferPools not found.' });

        options = {
          contract: contract._id,
          offerPool: offerPool.marketplaceCatalogIndex
        };
      }

      const totalCount = await context.db.MintedToken.countDocuments(options);
      const tokens = await context.db.MintedToken.find({
        ...options,
        token: !!lastToken ? { $gt: (firstToken - 1), $lt: (lastToken + 1) } : { $gt: (firstToken - 1) }
      })
        .sort([['token', 1]])
        .limit(numberOfTokens);

      return res.json({ success: true, result: { totalCount, tokens } });
    } catch (err) {
      next(err);
    }
  });

  router.get('/tokenNumbers', async (req, res, next) => {
    try {
      const { contract, product } = req;
      let options = {};

      if (contract.diamond) {
        const offers = await context.db.Offer.find({ contract: contract._id, product }).distinct('diamondRangeIndex');

        if (_.isEmpty(offers)) return res.status(404).send({ success: false, message: 'Offers not found.' });

        options = {
          contract: contract._id,
          offer: { $in: offers }
        };
      } else {
        const offerPool = await context.db.OfferPool.findOne({ contract: contract._id, product });

        if (_.isEmpty(offerPool)) return res.status(404).send({ success: false, message: 'OfferPools not found.' });

        options = {
          contract: contract._id,
          offerPool: offerPool.marketplaceCatalogIndex
        };
      }

      const tokens = await context.db.MintedToken.find(options).sort([['token', 1]]).distinct('token');

      return res.json({ success: true, tokens });
    } catch (err) {
      next(err);
    }
  });

  // Get list of files locked by token
  router.get('/files/:token', async (req, res, next) => {
    try {
      const { token } = req.params;
      const { contract, product } = req;
      const sanitizedToken = Number(token);
      const options = [
        {
          $lookup: {
            from: 'File',
            let: {
              contractT: '$contract',
              offerIndex: '$offer',
              productT: product
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
      ];

      if (contract.diamond) {
        const offers = await context.db.Offer.find({ contract: contract._id, product }).distinct('diamondRangeIndex');

        if (_.isEmpty(offers)) return res.status(404).send({ success: false, message: 'Offers not found.' });

        options.unshift({ $match: { contract: contract._id, offer: { $in: offers }, token: sanitizedToken } });
      } else {
        const offerPoolRaw = await context.db.OfferPool.findOne({ contract: contract._id, product });

        if (_.isEmpty(offerPoolRaw)) {
          res.json({ success: false, message: 'Offer pool which belong to this particular product not found.' });
          return;
        }

        const offerPool = offerPoolRaw.toObject();

        options.unshift({ $match: { contract: contract._id, offerPool: offerPool.marketplaceCatalogIndex, token: sanitizedToken } });
      }

      const files = await context.db.MintedToken.aggregate(options);

      res.json({ success: true, files });
    } catch (err) {
      next(err);
    }
  });

  // Get list of files for specific product
  router.get('/files/', async (req, res, next) => {
    try {
      const { contract, product } = req;

      const files = await context.db.File.find({ contract: contract._id, product });

      res.json({ success: true, files });
    } catch (err) {
      next(err);
    }
  });

  // get single product with all related offers
  router.get('/offers', async (req, res, next) => {
    try {
      const { contract, product: collectionIndexInContract } = req;

      const [product] = await context.db.Product.aggregate([
        { $match: { contract: contract._id, collectionIndexInContract } },
        {
          $lookup: {
            from: 'Offer',
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
            as: 'offers'
          }
        }
      ]);

      if (!product) {
        res.json({ success: false, message: 'Product not found.' });
        return;
      }

      res.json({ success: true, product: { ...product, owner: contract.user } });
    } catch (err) {
      next(err);
    }
  });

  // get locks for specific product
  router.get('/locks', async (req, res, next) => {
    try {
      const { contract, product } = req;

      const locks = await context.db.LockedTokens.find({ contract: contract._id, product });

      if (_.isEmpty(locks)) return res.status(404).send({ success: false, message: 'Locks not found.' });

      res.json({ success: true, locks });
    } catch (err) {
      next(err);
    }
  });

  // Token endpoints
  router.use('/token/:token', async (req, res, next) => {
    try {
      const { contract, product } = req;
      req.token = Number(req.params.token);

      if (contract.diamond) {
        const offers = await context.db.Offer.find({ contract: contract._id, product }).distinct('diamondRangeIndex');
        if (_.isEmpty(offers)) return res.status(404).send({ success: false, message: 'Offers not found.' });
        req.offers = offers;
      } else {
        const offerPool = await context.db.OfferPool.findOne({ contract: contract._id, product });
        if (_.isEmpty(offerPool)) return res.status(404).send({ success: false, message: 'OfferPool not found.' });
        req.offerPool = offerPool;
      }

      return next();
    } catch (e) {
      return next(e);
    }
  }, require('./token')(context));

  return router;
};
