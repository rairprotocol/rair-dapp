const Joi = require('joi');
const { ethAddress } = require('./reusableCustomTypes');

module.exports = {
  createUser: () => ({
    publicAddress: ethAddress.required(),
    email: Joi.string().email(),
  }),

  customUserFields: () => ({
    fields: Joi.string(),
  }),

  updateUser: () => ({
    nickName: Joi.string(),
    avatar: Joi.string(),
    background: Joi.string(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    blocked: Joi.boolean(),
  }),
};
