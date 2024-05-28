const nativeIpfsService = require('./ipfs');
const pinataService = require('./pinata');

module.exports = () => {
  switch (process.env.IPFS_SERVICE) {
    case 'pinata':
      return pinataService;
    case 'ipfs':
      return nativeIpfsService;
    default:
      return pinataService;
  }
};
