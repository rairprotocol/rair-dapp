const nativeIpfsService = require('./ipfs');
const pinataService = require('./pinata');
const config = require('../../config');

module.exports = () => {
  switch (config.ipfsService) {
    case 'pinata':
      return pinataService;
    case 'ipfs':
      return nativeIpfsService;
    default:
      return pinataService;
  }
};
