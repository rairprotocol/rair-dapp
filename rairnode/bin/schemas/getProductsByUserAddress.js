const { ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  userAddress: ethAddress.required(),
});
