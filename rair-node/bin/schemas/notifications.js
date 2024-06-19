const Joi = require('joi');

module.exports = {
  notificationsQuery: () => ({
    onlyRead: Joi.boolean(),
    onlyUnread: Joi.boolean(),
  }),
};
