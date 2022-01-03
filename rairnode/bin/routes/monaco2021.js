const express = require('express');
const _ = require('lodash');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router();

  // Get full data about particular product and get list of tokens for it
  router.get('/:adminToken/:contractName/:productName', async (req, res, next) => {
    try {
      const { adminToken, contractName, productName } = req.params;
      const adminContract = process.env.ADMIN_CONTRACT.toLowerCase();
      const user = await context.db.User.findOne({ adminNFT: `${ adminContract }:${ adminToken }` }, { publicAddress: 1 });

      if (_.isEmpty(user)) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      const [contract] = await context.db.Contract.aggregate([
        { $match: { user: user.publicAddress, title: contractName } },
        {
          $lookup: {
            from: 'Product',
            let: {
              contr: '$_id',
              productName
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
                          '$name',
                          '$$productName'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'products'
          }
        },
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
            as: 'offerPools'
          }
        },
        { $unwind: '$offerPools' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              contr: '$_id',
              productIndex: '$products.collectionIndexInContract',
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
                          '$$productIndex'
                        ]
                      },
                    ]
                  }
                }
              }
            ],
            as: 'products.offers'
          }
        }
      ]);

      if (_.isEmpty(contract)) {
        return res.status(404).send({ success: false, message: 'Product or contract not found.' });
      }

      const tokens = await context.db.MintedToken.find({ contract: contract._id, offerPool: contract.offerPools.marketplaceCatalogIndex });

      if (_.isEmpty(tokens)) {
        return res.status(404).send({ success: false, message: 'Tokens not found.' });
      }

      res.json({ success: true, result: { product: _.omit(contract, ['offerPools']), tokens } });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
