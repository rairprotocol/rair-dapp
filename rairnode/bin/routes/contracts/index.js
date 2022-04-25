const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  // Get list of contracts for specific user
  router.get('/', JWTVerification(context), async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;
      const contracts = await context.db.Contract.find({ user }, { _id: 1, contractAddress: 1, title: 1, blockchain: 1, diamond: 1 });

      res.json({ success: true, contracts });
    } catch (e) {
      next(e);
    }
  });

  // Get specific contract by ID
  router.get('/singleContract/:contractId', async (req, res, next) => {
    try {
      const contract = await context.db.Contract.findById(req.params.contractId, { _id: 1, contractAddress: 1, title: 1, blockchain: 1 });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  // Get list of contracts with all products and offers
  router.get('/full', validation('filterAndSort', 'query'), async (req, res, next) => {
    try {
      const { pageNum = '1', itemsPerPage = '20', blockchain = '', category = '' } = req.query;
      const pageSize = parseInt(itemsPerPage, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;

      const lookupProduct = {
        $lookup: {
          from: 'Product',
          let: {
            contr: '$_id'
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
                    }
                  ]
                }
              }
            }
          ],
          as: 'products'
        }
      };

      const foundCategory = await context.db.Category.findOne({ name: category });

      if (foundCategory) {
        _.set(lookupProduct, '$lookup.let.categoryF', foundCategory._id);
        _.set(lookupProduct, '$lookup.pipeline[0].$match.$expr.$and[1]', { $eq: ['$category', '$$categoryF'] });
      }

      const options = [
        lookupProduct,
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$_id',
              prod: '$products.collectionIndexInContract'
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
            as: 'offerPool'
          }
        },
        { $unwind: '$offerPool' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              offerPoolL: '$offerPool.marketplaceCatalogIndex',
              contractL: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$contract',
                          '$$contractL'
                        ]
                      },
                      {
                        $eq: [
                          '$offerPool',
                          '$$offerPoolL'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'products.offers'
          }
        }
      ];

      const foundBlockchain = await context.db.Blockchain.findOne({ hash: blockchain });

      if (foundBlockchain) {
        options.unshift({ $match: { blockchain } });
      }

      const totalNumber = _.chain(await context.db.Contract.aggregate(options).count('contracts'))
        .head()
        .get('contracts', 0)
        .value();

      const contracts = await context.db.Contract.aggregate(options)
        .sort({ ['products.name']: 1 })
        .skip(skip)
        .limit(pageSize);

      res.json({ success: true, contracts, totalNumber });
    } catch (e) {
      next(e);
    }
  });

  router.use('/network/:networkId/:contractAddress', JWTVerification(context), validation('singleContract', 'params'), async (req, res, next) => {
    const contract = await context.db.Contract.findOne({ contractAddress: req.params.contractAddress.toLowerCase(), blockchain: req.params.networkId });

    if (_.isEmpty(contract)) return res.status(404).send({ success: false, message: 'Contract not found.' });

    req.contract = contract;

    next();
  }, require('./contract')(context));

  return router
}
