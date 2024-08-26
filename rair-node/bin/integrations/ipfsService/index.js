const pinataService = require('./pinata');
const filebaseService = require('./filebase');

module.exports = () => {
  switch (process.env.IPFS_SERVICE) {
    case 'filebase':
      return filebaseService;
    case 'pinata':
      return pinataService;
    default:
      return pinataService;
  }
};
