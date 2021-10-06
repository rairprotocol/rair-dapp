const express = require('express');
const _ = require('lodash');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router();

  // Get metadata of specific NFT token by contract name, product name, offer name and token id
  router.get('/:adminToken/:contractName/:productName/:offerName', async (req, res, next) => {
    try {
      const { adminToken, contractName, productName, offerName } = req.params;
      const adminContract = process.env.ADMIN_CONTRACT.toLowerCase();
      const user = await context.db.User.findOne({ adminNFT: `${ adminContract }:${ adminToken }` }, { publicAddress: 1 });

      if (_.isEmpty(user)) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      const tokens = await context.db.Contract.aggregate([
        { $match: { user: user.publicAddress, title: contractName } },
        {
          $lookup: {
            from: 'Product',
            let: {
              contr: '$contractAddress',
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
            as: 'Product'
          }
        },
        { $unwind: '$Product' },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$contractAddress',
              productIndex: '$Product.collectionIndexInContract'
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
                      }
                    ]
                  }
                }
              }
            ],
            as: 'OfferPool'
          }
        },
        { $unwind: '$OfferPool' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              contr: '$contractAddress',
              productIndex: '$Product.collectionIndexInContract',
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
            as: 'Offer'
          }
        },
        { $unwind: '$Offer' },
        {
          $lookup: {
            from: 'MintedToken',
            let: {
              contr: '$contractAddress',
              offerPoolIndex: '$OfferPool.marketplaceCatalogIndex',
              offerIndex: '$Offer.offerIndex',
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
                          '$offerPool',
                          '$$offerPoolIndex'
                        ]
                      },
                      {
                        $eq: [
                          '$offer',
                          '$$offerIndex'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'Tokens'
          }
        },
        { $unwind: '$Tokens' }
      ]);

      if (_.isEmpty(tokens)) {
        return res.status(404).send({ success: false, message: 'Token not found.' });
      }

      res.json({ success: true, tokens });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
