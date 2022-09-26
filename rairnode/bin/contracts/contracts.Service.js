const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Contract, Blockchain, Category } = require('../models');
const AppError = require('../utils/errors/AppError');
const eFactory = require('../utils/entityFactory');
const {
  importContractData,
} = require('../integrations/ethers/importContractData');

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

// create like method
exports.importContractsMoralis = async (req, res, next) => {
  try {
    const { networkId, contractAddress, limit } = req.body;
    const { success, result, message } = await importContractData(
      networkId,
      contractAddress,
      limit,
      req.user, // jwtverify provides
    );
    return res.json({ success, result, message });
  } catch (err) {
    return next(err);
  }
};
exports.getSpecificContracts = async (req, res, next) => {
  try {
    let contract;
    if ((req.query.contractAddress && req.query.networkId) || req.query.contract) {
      contract = await Contract.findOne(req.query.contract
        ? { _id: ObjectID(req.query.contract) }
        : {
          contractAddress: req.query.contractAddress.toLowerCase(),
          blockchain: req.query.networkId,
        });
    } else {
      return next(new AppError('Cannot find contract: missing params', 400));
    }

    if (_.isEmpty(contract)) {
      return next(new AppError('Contract not found.', 404));
    }

    req.contract = contract;
    if (!req.query.contract) req.query.contract = contract._id;

    return next();
  } catch (e) {
    return next(e);
  }
};

exports.getFullContracts = async (req, res, next) => {
  try {
    const {
      pageNum = '1',
      itemsPerPage = '20',
      blockchain = '',
      contractAddress = '',
      contractId = '',
      addOffers = true,
      addLocks = false,
    } = req.query;
    const pageSize = parseInt(itemsPerPage, 10);
    const skip = (parseInt(pageNum, 10) - 1) * pageSize;
    const blockchainArr = blockchain.split(',');
    const contractAddressArr = contractAddress.split(',');
    const contractIdArr = contractId.split(',');
    const addOffersFlag = addOffers * 1;
    const addLocksFlag = addLocks * 1;
    const options = [Contract.lookupProduct, { $unwind: '$products' }];
    if (addLocksFlag) {
      options.push(Contract.lookupLockedTokens, { $unwind: '$tokenLock' });
    }
    if (addOffersFlag) {
      options.push(
        Contract.offerPoolLookup,
        {
          $unwind: {
            path: '$offerPool',
            preserveNullAndEmptyArrays: true,
          },
        },
        Contract.offerLookup,
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
    }

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
    if (contractIdArr.length >= 1 && contractIdArr[0] !== '') {
      const optionIds = [];
      contractIdArr.reduce(
        (prev, curr) => optionIds.push(new ObjectID(curr)),
        {},
      );
      options.unshift({
        $match: {
          _id: {
            $in: [...optionIds],
          },
        },
      });
    }
    if (contractAddressArr.length >= 1 && contractAddressArr[0] !== '') {
      options.unshift({
        $match: {
          contractAddress: {
            $in: [...contractAddressArr],
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

    res.json({ success: true, totalNumber, contracts });
  } catch (e) {
    next(e);
  }
};
