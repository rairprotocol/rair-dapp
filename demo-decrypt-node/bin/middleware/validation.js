const schemas = require('../schemas');

module.exports = (schemaName, destination = 'body') => (req, res, next) => {
  try {
    const schema = schemas[schemaName];
    const { error } = schema.validate(req[destination]);

    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map(e => e.message).join(',');

      console.log('error', message);
      res.status(400).json({ success: false, error: message })
    }
  } catch (err) {
    return next(err);
  }
};
