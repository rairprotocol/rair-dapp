const { ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  publicAddress: ethAddress.required(),
});
