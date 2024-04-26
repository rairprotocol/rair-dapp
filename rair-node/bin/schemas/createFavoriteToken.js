const { mongoId } = require('./reusableCustomTypes');

module.exports = () => ({
  token: mongoId
});
