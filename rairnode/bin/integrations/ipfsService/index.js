const nativeIpfsService = require('./ipfs');
const pinataService = require('./pinata');
const filebaseService = require('./filebase');

module.exports = () => {
  switch (process.env.IPFS_SERVICE) {
    case 'filebase':
      return filebaseService;
    case 'pinata':
      return pinataService;
    case 'ipfs':
      return nativeIpfsService;
    default:
      return pinataService;
  }
};
