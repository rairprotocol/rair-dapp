const { blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  networkId: blockchainNetworks.required(),
  contract: ethAddress.required(),
});
