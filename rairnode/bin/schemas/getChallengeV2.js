const Joi = require('joi');
const { ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  userAddress: ethAddress.required(),
  intent: Joi.string().required(),
  mediaId: Joi.string(),
  zoomId: Joi.string(),
});
