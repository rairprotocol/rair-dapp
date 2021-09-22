const express = require('express');
const _ = require('lodash');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router();

  // Get metadata of specific NFT token by contract name, product name, offer name and token id
  router.get('/:adminToken/:contractName/:productName/:offerName/:tokenId', async (req, res, next) => {
    try {
      const { adminToken, contractName, productName, offerName, tokenId } = req.params;
      const token = parseInt(tokenId);
      const user = await context.db.User.findOne({ adminNFT: `${ process.env.ADMIN_CONTRACT }:${ adminToken }` }, { publicAddress: 1 });

      if (_.isEmpty(user)) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      const [metadata] = await context.db.Contract.aggregate([
        { $match: { user: user.publicAddress, title: contractName } },
        {
          $lookup: {
            from: 'Product',
            let: {
              contr: '$contractAddress',
              productName: productName
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
            as: 'Products'
          }
        },
        { $unwind: '$Products' },
        { $replaceRoot: { newRoot: '$Products' } },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$contract',
              productIndex: '$collectionIndexInContract'
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
            as: 'OfferPools'
          }
        },
        { $unwind: '$OfferPools' },
        {
          $lookup: {
            from: 'Offer',
            let: {
              contr: '$contract',
              productIndex: '$collectionIndexInContract',
              offerN: offerName
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
                      {
                        $eq: [
                          '$offerName',
                          '$$offerN'
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'Offers'
          }
        },
        { $unwind: '$Offers' },
        {
          $lookup: {
            from: 'MintedToken',
            let: {
              contr: '$contract',
              offerPoolIndex: '$OfferPools.marketplaceCatalogIndex',
              offerIndex: '$Offers.offerIndex',
              tokenIndex: token
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
                      },
                      {
                        $eq: [
                          '$token',
                          '$$tokenIndex'
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
        { $unwind: '$Tokens' },
        { $replaceRoot: { newRoot: '$Tokens' } },
        { $replaceRoot: { newRoot: '$metadata' } },
      ]);

      if (_.isEmpty(metadata)) {
        return res.status(404).send({ success: false, message: 'Token not found.' });
      }

      res.json({ success: true, metadata });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
