const { blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  networkId: blockchainNetworks.required(),
  contractAddress: ethAddress.required(),
});
