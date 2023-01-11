const Joi = require('joi');

module.exports = Joi.object({
  pageNum: Joi.number().min(1),
  itemsPerPage: Joi.number().min(5),
  blockchain: Joi.string()
    .pattern(/^0x\w*/)
    .messages({ 'string.pattern.base': 'Invalid blockchain hash' }),
  // TODO: remove on V2
  category: Joi.string().min(1),
  userAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid user address' }),
  contractAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid contract address' }),
});
