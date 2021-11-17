const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  // Create contract
  router.post('/', JWTVerification(context), validation('createContract'), async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;
      const contract = await context.db.Contract.create({ user, ...req.body });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  // Get list of contracts for specific user
  router.get('/', JWTVerification(context), async (req, res, next) => {
    try {
      const { publicAddress: user } = req.user;
      const contracts = await context.db.Contract.find({ user }, { _id: 1, contractAddress: 1, title: 1, blockchain: 1 });

      res.json({ success: true, contracts });
    } catch (e) {
      next(e);
    }
  });

  // Get list of contracts with all products and offers
  router.get('/full', async (req, res, next) => {
    try {
      const contracts = await context.db.Contract.aggregate([
        { $lookup: { from: 'Product', localField: '_id', foreignField: 'contract', as: 'products' } },
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
              contractL: '$contractAddress'
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
      ]);

      res.json({ success: true, contracts });
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
