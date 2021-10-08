const express = require('express');
const _ = require('lodash');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router();

  // Get metadata of specific NFT token by contract name, product name, offer name and token id
  router.get('/:adminToken/:contractName/:productName', async (req, res, next) => {
    try {
      const { adminToken, contractName, productName } = req.params;
      const adminContract = process.env.ADMIN_CONTRACT.toLowerCase();
      const user = await context.db.User.findOne({ adminNFT: `${ adminContract }:${ adminToken }` }, { publicAddress: 1 });

      if (_.isEmpty(user)) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      const [product] = await context.db.Contract.aggregate([
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
            as: 'products'
          }
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'OfferPool',
            let: {
              contr: '$contractAddress',
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
            localField: 'offerPools.marketplaceCatalogIndex',
            foreignField: 'offerPool',
            as: 'products.offers'
          }
        }
      ]);

      if (_.isEmpty(product)) {
        return res.status(404).send({ success: false, message: 'Product or contract not found.' });
      }

      const tokens = await context.db.MintedToken.find({ contract: product.contractAddress, offerPool: product.offerPools.marketplaceCatalogIndex });

      if (_.isEmpty(tokens)) {
        return res.status(404).send({ success: false, message: 'Tokens not found.' });
      }

      res.json({ success: true, result: { product: _.omit(product, ['offerPools']), tokens } });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
