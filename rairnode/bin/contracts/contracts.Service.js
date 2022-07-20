const { Contract } = require('../models');
const eFactory = require('../utils/entityFactory');

exports.getAllContracts = eFactory.getAll(Contract);

exports.getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id, {
      _id: 1,
      contractAddress: 1,
      title: 1,
      blockchain: 1,
      diamond: 1,
    });

    res.json({ success: true, contract });
  } catch (e) {
    next(e);
  }
};

exports.getContractsByUserAddress = async (req, res, next) => {
  try {
    const user = req.params.userAddress.toLowerCase();
    const contracts = await this.findContractsByUser(user);
    res.json({ success: true, contracts });
  } catch (e) {
    next(e);
  }
};

exports.findContractsByUser = async (user) => {
  const contracts = await Contract.find(
    { user },
    {
      _id: 1,
      contractAddress: 1,
      title: 1,
      blockchain: 1,
      diamond: 1,
    },
  );
  return contracts;
};

exports.getContractsIdsForUser = async (user) => {
  const contracts = await Contract.find(
    { user },
    {
      _id: 1,
      contractAddress: 1,
      title: 1,
      blockchain: 1,
      diamond: 1,
    },
  ).distinct('_id');
  return contracts;
};
