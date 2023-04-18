const Joi = require('joi');

module.exports = () => ({
  type: Joi.any()
    .valid('video', 'audio')
    .required(),
  // mimetype: Joi.any()
  //  .valid('video/mp4', 'video/quicktime')
  //  .required()
}).unknown();
