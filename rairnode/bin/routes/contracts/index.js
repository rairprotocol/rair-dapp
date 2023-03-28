const express = require('express');
const _ = require('lodash');
const AppError = require('../../utils/errors/AppError');
const {
  validation,
  isAdmin,
  requireUserSession,
  loadUserSession,
} = require('../../middleware');
const {
  importContractData,
} = require('../../integrations/ethers/importContractData');
const log = require('../../utils/logger')(module);
const contractRoutes = require('./contract');
const { Contract, User, File } = require('../../models');

const getContractsByUser = async (user, res, next) => {
  try {
    const contracts = await Contract.find(user ? { user } : {}, {
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
};

module.exports = (context) => {
  const router = express.Router();

  router.get(
    '/imported',
    async (req, res, next) => {
      try {
        const contracts = await Contract.find({
          importedBy: req.session.userData.publicAddress,
        });
        return res.json({
          success: true,
          contracts,
        });
      } catch (err) {
        return next(err);
      }
    },
  );

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
          category = [],
        } = req.query;
        const pageSize = parseInt(itemsPerPage, 10);
        const skip = (parseInt(pageNum, 10) - 1) * pageSize;
        const blockchainArr = blockchain.split(',');

        const options = [];

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
        options.push(lookupProduct, { $unwind: '$products' });

        if (category.length > 0) {
          const matchingContractsForCategory = (await File.find({
            category: { $in: category },
          }, {
            contract: 1,
          })).map((item) => item.contract);

          options.push({
            $match: {
              _id: { $in: matchingContractsForCategory },
            },
          });
        }

        options.push(
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
        );

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
          await Contract.aggregate(options).count('contracts'),
        )
          .head()
          .get('contracts', 0)
          .value();

        const contracts = await Contract.aggregate(options)
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
  router.get('/', requireUserSession, (req, res, next) => {
    const { publicAddress: user, superAdmin } = req.user;

    if (superAdmin) {
      return getContractsByUser(null, res, next);
    }

    return getContractsByUser(user, res, next);
  });

  // Get list of contracts for specific user
router.get('byUser/:userId', loadUserSession, async (req, res, next) => {
    const userFound = await User.findOne({
      _id: req.params.userId,
    });
    const { publicAddress: user } = userFound;
    await getContractsByUser(user, res, next);
  });

  // Get specific contract by ID
  router.get('/singleContract/:contractId', async (req, res, next) => {
    try {
      const contract = await Contract.findById(
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

  router.post(
    '/import/',
    requireUserSession,
    isAdmin,
    validation('importContract', 'body'),
    async (req, res, next) => {
      try {
        if (!req.user.adminRights) {
          log.error("User doesn't have admin rights");
          return {
            success: false,
            result: undefined,
            message: 'Admin rights are required to import!',
          };
        }
        const { networkId, contractAddress, limit, contractCreator } = req.body;
        const { success, result, message } = await importContractData(
          networkId,
          contractAddress,
          limit,
          contractCreator,
          req.user.publicAddress,
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
    validation('singleContract', 'params'),
    async (req, res, next) => {
      const contract = await Contract.findOne({
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
