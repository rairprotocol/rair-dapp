const schemas = require('../schemas');
const log = require('../utils/logger')(module);

module.exports = (schemaName, destination = 'body') => (req, res, next) => {
  try {
    const schema = schemas[schemaName];
    const { error } = schema.validate(req[destination]);

    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map(e => e.message).join(',');

      log.error(message);

      res.status(400).json({ success: false, error: true, message })
    }
  } catch (err) {
    return next(err);
  }
};
