const ethers = require('ethers');
const { Blockchain } = require('../models');

const getProvider = async (network) => {
  const chain = await Blockchain.findOne({ hash: network });
  return new ethers.providers.StaticJsonRpcProvider(
    chain.rpcEndpoint,
    {
      chainId: chain.numericalId,
    },
  );
};

module.exports = {
  getProvider,
};
