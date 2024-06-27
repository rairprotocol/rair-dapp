const _ = require('lodash');
const { ObjectId } = require('mongodb');
const log = require('../../utils/logger');
const { Contract, Blockchain, File, Product } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const eFactory = require('../../utils/entityFactory');
const {
  importContractData,
} = require('../../integrations/ethers/importContractData');

module.exports = {
  updateContract: eFactory.updateOne(Contract),
  offersByNetworkAndAddress: async (req, res, next) => {
    try {
      const { contract } = req;

      let products;

      const commonQuery = [
        { $match: { contract: contract._id } },
        { $sort: { creationDate: -1 } },
      ];

      if (contract?.diamond) {
        products = await Product.aggregate([
          ...commonQuery,
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
                          $eq: [
                            '$contract',
                            '$$contr',
                          ],
                        },
                        {
                          $eq: [
                            '$product',
                            '$$prod',
                          ],
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
      } else {
        products = await Product.aggregate([
          ...commonQuery,
          {
            $lookup: {
              from: 'OfferPool',
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
                          $eq: [
                            '$contract',
                            '$$contr',
                          ],
                        },
                        {
                          $eq: [
                            '$product',
                            '$$prod',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'offerPool',
            },
          },
          { $unwind: '$offerPool' },
          {
            $lookup: {
              from: 'Offer',
              let: {
                offerPoolL: '$offerPool.marketplaceCatalogIndex',
                contractL: '$contract',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$contract',
                            '$$contractL',
                          ],
                        },
                        {
                          $eq: [
                            '$offerPool',
                            '$$offerPoolL',
                          ],
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
      }

      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  },
  findContractByNetworkAndAddress: async (req, res, next) => {
    try {
      res.json({ success: true, contract: req.contract });
    } catch (e) {
      next(e);
    }
  },
  productsByNetworkAndAddress: async (req, res, next) => {
    try {
      const { contract } = req;
      const products = await Product.find({ contract: contract._id });
      res.json({ success: true, products });
    } catch (err) {
      next(err);
    }
  },
  searchContractByNetworkAndAddress: async (req, res, next) => {
    const contract = await Contract.findOne({
      contractAddress: req.params.contractAddress.toLowerCase(),
      blockchain: req.params.networkId,
    });

    if (!contract) {
      return next(new AppError('Contract not found.', 404));
    }

    req.contract = contract;

    return next();
  },
  importExternalContract: async (req, res, next) => {
    try {
      const { networkId, contractAddress, limit, contractCreator } = req.body;
      const socket = req.app.get('socket');
      importContractData(
        networkId,
        contractAddress,
        limit,
        contractCreator,
        req.user.publicAddress,
        socket,
      );
      return res.json({ success: true });
    } catch (err) {
      log.error(err);
      return next(err);
    }
  },
  fullListOfContracts: async (req, res, next) => {
    try {
      const {
        pageNum = '1',
        itemsPerPage = '20',
        blockchain = '',
        category = [],
        hidden = false,
        contractTitle = '',
      } = req.query;
      const pageSize = parseInt(itemsPerPage, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;
      const blockchainArr = blockchain === '' ? [] : blockchain.split(',');

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
      const lookupUser = {
        $lookup: {
          from: 'User',
          let: {
            usr: '$user',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$publicAddress', '$$usr'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'userData',
        },
      };
      options.push(lookupUser, {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true,
        },
      });

      if (category.length > 0) {
        const categoryIds = category.map((cat) => new ObjectId(cat));
        const matchingMedia = await File.aggregate([
          {
            $match: {
              category: {
                $in: categoryIds,
              },
            },
          }, {
            $lookup: {
              from: 'Unlock',
              localField: '_id',
              foreignField: 'file',
              as: 'unlockData',
            },
          }, {
            $lookup: {
              from: 'Offer',
              localField: 'unlockData.offers',
              foreignField: '_id',
              as: 'unlockData.offers',
            },
          },
        ]);

        const matchingContractsForCategory = matchingMedia
          .filter((item) => !!item?.unlockData?.offers?.length)
          .reduce((result, item) => {
            const contractsForVideos = item.unlockData.offers.map((offer) => offer.contract);
            return [...result, ...contractsForVideos];
          }, []);

        options.push({
          $match: {
            _id: { $in: matchingContractsForCategory },
          },
        });
      }

      options.push(
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
                'products.offers': { $not: { $size: 0 } },
              },
            ],
          },
        },
      );

      const blockchainFilter = {
        display: { $ne: false },
      };
      if (blockchainArr?.length >= 1) {
        blockchainFilter.hash = [...blockchainArr];
      }
      const foundBlockchain = await Blockchain.find(blockchainFilter);

      options.unshift({
        $match: {
          blockchain: { $in: foundBlockchain.map((chain) => chain.hash) },
        },
      });
      if (foundBlockchain.length === 0 && blockchain.length >= 1) {
        return next(new AppError('Invalid blockchain.', 404));
      }

      if (!hidden) {
        options.unshift({
          $match: {
            blockView: false,
          },
        });
      }
      if (contractTitle !== '') {
        options.unshift({
          $match: {
            title: { $regex: contractTitle, $options: 'i' },
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

      return res.json({ success: true, contracts, totalNumber });
    } catch (e) {
      return next(e);
    }
  },
  contractListForFactory: async (req, res, next) => {
    try {
      const { publicAddress: user, superAdmin } = req.user;
      const foundBlockchain = await Blockchain.find({
        display: { $ne: false },
      });
      const contractQuery = {
        blockView: false,
        blockchain: foundBlockchain.map((chain) => chain.hash),
      };
      if (!superAdmin) {
        contractQuery.user = user;
      }
      const contracts = await Contract.find(contractQuery, {
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
  },
  getAllContracts: async (req, res, next) => {
    const {
      pageNum = 1,
      itemsPerPage = 10,
      ...query
    } = req.query;
    const pageSize = parseInt(itemsPerPage, 10);
    const skip = (parseInt(pageNum, 10) - 1) * pageSize;

    const clearFilter = {};
    ['external', 'blockView', 'blockSync']
      .forEach((field) => {
        if (query[field] === 'true') {
          query[field] = true;
        } else if (query[field] === 'false') {
          query[field] = false;
        }
      });
    Object.keys(query).forEach((item) => {
      if (query[item] !== undefined) {
        clearFilter[item] = query[item];
      }
    });

    const foundBlockchain = await Blockchain.find({
      display: { $ne: false },
    });

    const pipeline = [
      {
          $match: {
              blockView: false,
              blockchain: { $in: foundBlockchain.map((chain) => chain.hash) },
              ...clearFilter,
          },
      },
    ];

    const count = await Contract.aggregate([
      ...pipeline,
      {
        $count: 'totalCount',
      },
    ]);

    if (itemsPerPage !== 'all') {
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: pageSize });
    }
    const result = await Contract.aggregate([...pipeline]);

    res.json({ success: true, result, totalCount: count[0]?.totalCount });
  },
  getContractById: async (req, res, next) => {
    try {
      const contract = await Contract.findById(
        req.params.id,
        Contract.defaultProjection,
      );
      if (!contract) {
        next(new AppError(`No contract found with ID ${req.params.id}`, 404));
      } else {
        res.json({ success: true, contract });
      }
    } catch (e) {
      next(e);
    }
  },
  getContractsByUserAddress: async (req, res, next) => {
    try {
      const user = req.params.userAddress.toLowerCase();
      const contracts = await Contract.findContractsByUser(user);
      if (!contracts) {
        next(new AppError(`No contract found for user ${user}`, 404));
      } else {
        res.json({ success: true, contracts });
      }
    } catch (e) {
      next(e);
    }
  },
  queryMyContracts: async (req, res, next) => {
    try {
      let user;
      if (req.query.user) {
        user = req.query.user.toLowerCase();
      }
      req.query.user = req.user.superAdmin
        ? user || undefined
        : req.user.publicAddress;
      next();
    } catch (e) {
      next(e);
    }
  },
  getSpecificContracts: async (req, res, next) => {
    try {
      let foundContract;
      const { contractAddress, networkId, contract } = req.query;
      if (contract) {
        foundContract = await Contract.findById(contract);
      } else if (contractAddress && networkId) {
        foundContract = await Contract.findOne({
          contractAddress,
          blockchain: networkId,
        });
        req.query.contractAddress = undefined;
        req.query.networkId = undefined;
      } else {
        return next(new AppError('Cannot find contract: missing params', 400));
      }
      if (!foundContract) {
        return next(new AppError('Contract not found.', 404));
      }

      req.contract = foundContract;
      if (!req.query.contract) {
        req.query.contract = foundContract._id;
      }

      return next();
    } catch (e) {
      return next(e);
    }
  },
};
