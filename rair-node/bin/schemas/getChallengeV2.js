const Joi = require('joi');
const { ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  userAddress: ethAddress.required(),
  intent: Joi.string().required(),
  ownerAddress: ethAddress,
  mediaId: Joi.string(),
  zoomId: Joi.string(),
});
