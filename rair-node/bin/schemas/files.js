const Joi = require('joi');
const { mongoId } = require('./reusableCustomTypes');

module.exports = {
  updateMedia: () => ({
    title: Joi.string().min(1).max(30),
    description: Joi.string().min(1).max(300),
    contract: Joi.string(),
    product: Joi.string(),
    offer: Joi.array().items(mongoId),
    category: Joi.string().min(1),
    demo: Joi.boolean(),
  }),
  offerArray: () => ({
    offers: Joi.array().items(mongoId).required(),
  }),
  singleOffer: () => ({
    offer: mongoId.required(),
  }),
};
