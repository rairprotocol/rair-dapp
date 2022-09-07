const _ = require('lodash');
const { Contract, Blockchain, Category } = require('../models');
const AppError = require('../utils/appError');
const eFactory = require('../utils/entityFactory');

exports.getAllContracts = eFactory.getAll(Contract);

exports.getContractById = async (req, res, next) => {
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
};

exports.getContractsByUserAddress = async (req, res, next) => {
  try {
    const user = req.params.userAddress.toLowerCase();
    const contracts = await this.findContractsByUser(user);
    if (!contracts) {
      next(new AppError(`No contract found for user ${user}`, 404));
    } else {
      res.json({ success: true, contracts });
    }
  } catch (e) {
    next(e);
  }
};

exports.getMyContracts = async (req, res, next) => {
  try {
    const user = req.user.publicAddress;
    const contracts = await this.findContractsByUser(user);

    if (!contracts || contracts.length < 1) {
      next(new AppError('No contract found for user', 404));
    } else {
      res.json({ success: true, contracts });
    }
  } catch (e) {
    next(e);
  }
};

exports.findContractsByUser = async (user) =>
  Contract.find({ user }, Contract.defaultProjection);

exports.getContractsIdsForUser = async (user) =>
  Contract.find({ user }, Contract.defaultProjection).distinct('_id');

exports.getFullContracts = async (req, res, next) => {
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

    const foundCategory = await Category.findOne({
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

    const foundBlockchain = await Blockchain.find({
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
};
