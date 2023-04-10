const { Network, Alchemy } = require('alchemy-sdk');

const networkMapping = {
  '0x1': Network.ETH_MAINNET,
  '0x5': Network.ETH_GOERLI,
  '0x89': Network.MATIC_MAINNET,
  '0x13881': Network.MATIC_MUMBAI,
  '0x250': Network.ASTAR_MAINNET,
};

module.exports = {
  getAlchemy: (network) => {
    const settings = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: networkMapping[network],
    };
    const alchemy = new Alchemy(settings);
    return alchemy;
  },
};
