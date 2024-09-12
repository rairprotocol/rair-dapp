const pinataService = require('./pinata');
const config = require('../../config');

module.exports = () => {
  switch (config.ipfsService) {
    case 'pinata':
      return pinataService;
    default:
      return pinataService;
  }
};
