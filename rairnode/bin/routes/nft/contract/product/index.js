const express = require('express');
const _ = require('lodash');
const { validation, assignUser } = require('../../../../middleware');
const { verifyAccessRightsToFile } = require('../../../../utils/helpers');
const { Offer, OfferPool, Product, MintedToken, File, LockedTokens } = require('../../../../models');
const tokenRoutes = require('./token');

module.exports = (context) => {
  const router = express.Router();

  // Get minted tokens from a product
  router.get(
    '/',
    validation('getTokensByContractProduct', 'query'),
    async (req, res, next) => {
      try {
        const { contract, product } = req;
        const {
          fromToken = 0,
          toToken,
          sortByToken = '1',
          sortByPrice = '',
          priceFrom = '',
          priceTo = '',
          forSale = '',
        } = req.query;
        const firstToken = (BigInt(fromToken) - 1n).toString();
        const lastToken = !toToken
          ? (BigInt(fromToken) + 1n + BigInt(20)).toString()
          : (BigInt(toToken) + 1n).toString();
        let options = {
          token:
            lastToken - 1
              ? { $gt: firstToken, $lt: lastToken }
              : { $gt: firstToken },
        };
        const filterOptions = {};
        const populateOptions = {
          let: { contr: '$contract' },
          and: [
            {
              $eq: [
                '$contract',
                '$$contr',
              ],
            },
          ],
        };

        // set filters
        if (priceFrom || priceTo) {
          filterOptions['offer.price'] = _.assign({},priceFrom ? { $gte: priceFrom } : {}, priceTo ? { $lte: priceTo } : {});
        }

        if (forSale !== '') {
          filterOptions.isMinted = forSale !== 'true';
        }

        if (contract.diamond) {
          const offers = await Offer.find({
            contract: contract._id,
            product,
          }).distinct('diamondRangeIndex');

          if (_.isEmpty(offers)) {
            return res
              .status(404)
              .send({ success: false, message: 'Offers not found.' });
          }

          options = {
            contract: contract._id,
            offer: { $in: offers },
          };
          populateOptions.let = _.assign(populateOptions.let, { diamondRangeI: '$offer' });
          populateOptions.and = _.concat(populateOptions.and, [
            {
              $eq: [
                '$diamondRangeIndex',
                '$$diamondRangeI',
              ],
            },
          ]);
        } else {
          const offerPool = await OfferPool.findOne({
            contract: contract._id,
            product,
          });

          if (_.isEmpty(offerPool)) {
            return res
              .status(404)
              .send({ success: false, message: 'OfferPools not found.' });
          }

          options = {
            contract: contract._id,
            offerPool: offerPool.marketplaceCatalogIndex,
          };
          populateOptions.let = _.assign(populateOptions.let, { offeP: '$offerPool', offerIn: '$offer' });
          populateOptions.and = _.concat(populateOptions.and, [
            {
              $eq: [
                '$offerPool',
                '$$offeP',
              ],
            },
            {
              $eq: [
                '$offerIndex',
                '$$offerIn',
              ],
            },
          ]);
        }

        const aggregateOptions = [
          { $match: {
            ...options,
            token:
                lastToken - 1
                  ? { $gt: firstToken, $lt: lastToken }
                  : { $gt: firstToken },
          } },
          {
            $lookup: {
              from: 'Offer',
              let: populateOptions.let,
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: populateOptions.and,
                    },
                  },
                },
              ],
              as: 'offer',
            },
          },
          { $unwind: '$offer' },
          { $match: filterOptions },
        ];

        const optionsForTotalCount = _.cloneDeep(aggregateOptions);

        optionsForTotalCount.shift();
        optionsForTotalCount.unshift({ $match: options });

        const totalCount = _.chain(
          await MintedToken.aggregate(optionsForTotalCount)
            .count('tokens')
            .collation({ locale: 'en_US', numericOrdering: true }),
        )
          .head()
          .get('tokens', 0)
          .value();

        const tokens = await MintedToken.aggregate(aggregateOptions)
          .sort(_.assign({}, sortByPrice ? { 'offer.price': Number(sortByPrice) } : {}, sortByToken ? { token: Number(sortByToken) } : {}))
          .collation({ locale: 'en_US', numericOrdering: true });

        return res.json({ success: true, result: { totalCount, tokens } });
      } catch (err) {
        return next(err);
      }
    },
  );

  router.get('/tokenNumbers', async (req, res, next) => {
    try {
      const { contract, product } = req;
      let options = {};

      if (contract.diamond) {
        const offers = await Offer.find({
          contract: contract._id,
          product,
        }).distinct('diamondRangeIndex');

        if (_.isEmpty(offers)) {
          return res
            .status(404)
            .send({ success: false, message: 'Offers not found.' });
        }

        options = {
          contract: contract._id,
          offer: { $in: offers },
        };
      } else {
        const offerPool = await OfferPool.findOne({
          contract: contract._id,
          product,
        });

        if (_.isEmpty(offerPool)) {
          return res
            .status(404)
            .send({ success: false, message: 'OfferPools not found.' });
        }

        options = {
          contract: contract._id,
          offerPool: offerPool.marketplaceCatalogIndex,
        };
      }

      const tokens = await MintedToken.find(options)
        .sort([['token', 1]])
        .collation({ locale: 'en_US', numericOrdering: true })
        .distinct('token');

      return res.json({ success: true, tokens });
    } catch (err) {
      return next(err);
    }
  });

  // Get list of files locked by token
  router.get('/files/:token', async (req, res, next) => {
    try {
      const { token } = req.params;
      const { contract, product } = req;
      const sanitizedToken = token;
      const options = [
        {
          $lookup: {
            from: 'File',
            let: {
              contractT: '$contract',
              offerIndex: '$offer',
              productT: product,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$contract', '$$contractT'],
                      },
                      {
                        $eq: ['$product', '$$productT'],
                      },
                      {
                        $in: ['$$offerIndex', '$offer'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'files',
          },
        },
        { $unwind: '$files' },
        { $replaceRoot: { newRoot: '$files' } },
      ];

      if (contract.diamond) {
        const offers = await Offer.find({
          contract: contract._id,
          product,
        }).distinct('diamondRangeIndex');

        if (_.isEmpty(offers)) {
          return res
            .status(404)
            .send({ success: false, message: 'Offers not found.' });
        }

        options.unshift({
          $match: {
            contract: contract._id,
            offer: { $in: offers },
            token: sanitizedToken,
          },
        });
      } else {
        const offerPoolRaw = await OfferPool.findOne({
          contract: contract._id,
          product,
        });

        if (_.isEmpty(offerPoolRaw)) {
          return res.json({
            success: false,
            message:
              'Offer pool which belong to this particular product not found.',
          });
        }

        const offerPool = offerPoolRaw.toObject();

        options.unshift({
          $match: {
            contract: contract._id,
            offerPool: offerPool.marketplaceCatalogIndex,
            token: sanitizedToken,
          },
        });
      }

      const files = await MintedToken.aggregate(options);

      return res.json({ success: true, files });
    } catch (err) {
      return next(err);
    }
  });

  // Get list of files for specific product
  router.get('/files', assignUser, async (req, res, next) => {
    try {
      const { contract, product } = req;

      let files = await File.find({
        contract: contract._id,
        product,
      });

      // verify the user have needed tokens for unlock the files
      files = await verifyAccessRightsToFile(files, req.user);

      res.json({ success: true, files });
    } catch (err) {
      next(err);
    }
  });

  // get single product with all related offers
  router.get('/offers', async (req, res, next) => {
    try {
      const { contract, product: collectionIndexInContract } = req;

      const [product] = await Product.aggregate([
        { $match: { contract: contract._id, collectionIndexInContract } },
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
                        $eq: ['$contract', '$$contr'],
                      },
                      {
                        $eq: ['$product', '$$prod'],
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

      if (!product) {
        res.json({ success: false, message: 'Product not found.' });
        return;
      }

      res.json({
        success: true,
        product: { ...product, owner: contract.user },
      });
    } catch (err) {
      next(err);
    }
  });

  // get locks for specific product
  router.get('/locks', async (req, res, next) => {
    try {
      const { contract, product } = req;

      const locks = await LockedTokens.find({
        contract: contract._id,
        product,
      });

      if (_.isEmpty(locks)) {
        return res
          .status(404)
          .send({ success: false, message: 'Locks not found.' });
      }

      return res.json({ success: true, locks });
    } catch (err) {
      return next(err);
    }
  });

  // Token endpoints
  router.use(
    '/token/:token',
    async (req, res, next) => {
      try {
        const { contract, product } = req;
        req.token = req.params.token;

        if (contract.diamond) {
          const offers = await Offer.find({
            contract: contract._id,
            product,
          }).distinct('diamondRangeIndex');
          if (_.isEmpty(offers)) {
            return res
              .status(404)
              .send({ success: false, message: 'Offers not found.' });
          }
          req.offers = offers;
        } else {
          const offerPool = await OfferPool.findOne({
            contract: contract._id,
            product,
          });
          if (_.isEmpty(offerPool)) {
            return res
              .status(404)
              .send({ success: false, message: 'OfferPool not found.' });
          }
          req.offerPool = offerPool;
        }
        return next();
      } catch (e) {
        return next(e);
      }
    },
    tokenRoutes(context),
  );

  return router;
};
