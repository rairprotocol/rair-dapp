const Joi = require('joi');

module.exports = Joi.object({
  mimetype: Joi.any()
    .valid('video/mp4', 'video/quicktime')
    .required()
}).unknown();
