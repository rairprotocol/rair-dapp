const ethers = require('ethers');
const { blockchain } = require('../config');
const endpoints = require('../config/blockchainEndpoints');

const providersMapping = {};
let globalCounter = 0;

Object.keys(blockchain.networks).forEach((item) => {
  const newProvider = new ethers.providers.StaticJsonRpcProvider(
    endpoints[item],
    {
      chainId: parseInt(item, 16),
    },
  );

  newProvider.on('debug', ({ action, request, response, provider }) => {
    action &&
      console.log(
        `Action #${providersMapping[item].count} on ${item} (#${globalCounter} global):`,
        action,
      );
    // request && console.log(response ? 'Receiving response' : 'Sending request', request.method);
    if (request && !response) {
      globalCounter++;
      providersMapping[item].count++;
    }
  });

  providersMapping[item] = {
    count: 0,
    provider: newProvider,
  };
});

module.exports = {
  providersMapping,
};
