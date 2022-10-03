const express = require('express');
const _ = require('lodash');
const AppError = require('../../utils/errors/AppError');
const {
  JWTVerification,
  validation,
  isAdmin,
  isSuperAdmin,
} = require('../../middleware');
const {
  importContractData,
} = require('../../integrations/ethers/importContractData');
const log = require('../../utils/logger')(module);
const contractRoutes = require('./contract');

module.exports = (context) => {
  const router = express.Router();

  async function getContractsByUser(user, res, next) {
    // Contex is part of global scope
    try {
      const contracts = await context.db.Contract.find(user ? { user } : {}, {
        _id: 1,
        contractAddress: 1,
        title: 1,
        blockchain: 1,
        diamond: 1,
      });
      return res.json({ success: true, contracts });
    } catch (e) {
      return next(e);
    }
  }

  // Get list of contracts with all products and offers
  router.get(
    '/full',
    validation('filterAndSort', 'query'),
    async (req, res, next) => {
      try {
        const {
          pageNum = '1',
          itemsPerPage = '20',
          blockchain = '',
          category = '',
        } = req.query;
        const pageSize = parseInt(itemsPerPage, 10);
        const skip = (parseInt(pageNum, 10) - 1) * pageSize;
        const blockchainArr = blockchain.split(',');

        const lookupProduct = {
          $lookup: {
            from: 'Product',
            let: {
              contr: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$contract', '$$contr'],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'products',
          },
        };

        const foundCategory = await context.db.Category.findOne({
          name: category,
        });

        if (foundCategory) {
          _.set(lookupProduct, '$lookup.let.categoryF', foundCategory._id);
          _.set(lookupProduct, '$lookup.pipeline[0].$match.$expr.$and[1]', {
            $eq: ['$category', '$$categoryF'],
          });
        }

        const options = [
          lookupProduct,
          { $unwind: '$products' },
          {
            $lookup: {
              from: 'OfferPool',
              let: {
                contr: '$_id',
                prod: '$products.collectionIndexInContract',
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
              as: 'offerPool',
            },
          },
          {
            $unwind: {
              path: '$offerPool',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'Offer',
              let: {
                prod: '$products.collectionIndexInContract',
                contractL: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$contract', '$$contractL'],
                        },
                        {
                          $eq: ['$product', '$$prod'],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'products.offers',
            },
          },
          {
            $match: {
              $or: [
                { diamond: true, 'products.offers': { $not: { $size: 0 } } },
                {
                  diamond: { $in: [false, undefined] },
                  offerPool: { $ne: null },
                  'products.offers': { $not: { $size: 0 } },
                },
              ],
            },
          },
        ];

        const foundBlockchain = await context.db.Blockchain.find({
          hash: [...blockchainArr],
        });

        if (foundBlockchain.length >= 1) {
          options.unshift({
            $match: {
              blockchain: {
                $in: [...blockchainArr],
              },
            },
          });
        }

        const totalNumber = _.chain(
          await context.db.Contract.aggregate(options).count('contracts'),
        )
          .head()
          .get('contracts', 0)
          .value();

        const contracts = await context.db.Contract.aggregate(options)
          .sort({ 'products.name': 1 })
          .skip(skip)
          .limit(pageSize);

        res.json({ success: true, contracts, totalNumber });
      } catch (e) {
        next(e);
      }
    },
  );

  // Get list of contracts for current user or all contracts if user have superAdmin rights
  router.get('/', JWTVerification, isSuperAdmin, (req, res, next) => {
    const { publicAddress: user, superAdmin } = req.user;

    if (superAdmin) {
      return getContractsByUser(null, res, next);
    }

    return getContractsByUser(user, res, next);
  });

  // Get list of contracts for specific user
  router.get('byUser/:userId', JWTVerification, async (req, res, next) => {
    const userFound = await context.db.User.findOne({
      _id: req.params.userId,
    });
    const { publicAddress: user } = userFound;
    await getContractsByUser(user, res, next);
  });

  // Get specific contract by ID
  router.get('/singleContract/:contractId', async (req, res, next) => {
    try {
      const contract = await context.db.Contract.findById(
        req.params.contractId,
        {
          _id: 1,
          contractAddress: 1,
          title: 1,
          blockchain: 1,
        },
      );

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  router.get(
    '/import/network/:networkId/:contractAddress/:limit',
    JWTVerification,
    isAdmin,
    async (req, res, next) => {
      try {
        const { networkId, contractAddress, limit } = req.params;
        const { success, result, message } = await importContractData(
          networkId,
          contractAddress,
          limit,
          req.user,
        );
        return res.json({ success, result, message });
      } catch (err) {
        log.error(err);
        return next(err);
      }
    },
  );

  router.use(
    '/network/:networkId/:contractAddress',
    JWTVerification,
    validation('singleContract', 'params'),
    async (req, res, next) => {
      const contract = await context.db.Contract.findOne({
        contractAddress: req.params.contractAddress.toLowerCase(),
        blockchain: req.params.networkId,
      });

      if (_.isEmpty(contract)) {
        return next(new AppError('Contract not found.', 404));
      }

      req.contract = contract;

      return next();
    },
    contractRoutes(context),
  );

  return router;
};
