const admin = require('./admin');
const addMedia = require('./addMedia');
const authentication = require('./authentication');
const createContract = require('./createContract');
const createUser = require('./createUser');
const getChallenge = require('./getChallenge');
const getFiles = require('./getFiles');
const getToken = require('./getToken');
const singleUser = require('./singleUser');
const newAdmin = require('./newAdmin');
const newAdminParams = require('./newAdminParams');
const removeMedia = require('./removeMedia');
const stream = require('./stream');
const uploadVideo = require('./uploadVideo');
const uploadVideoFile = require('./uploadVideoFile');
const updateContract = require('./updateContract');
const updateUser = require('./updateUser');
const singleContract = require('./singleContract');
const getFilesByNFT = require('./getFilesByNFT');
const nftContract = require('./nftContract');
const nftProduct = require('./nftProduct');
const getTokensByContractProduct = require('./getTokensByContractProduct');
const search = require('./search');

module.exports = {
  admin,
  addMedia,
  authentication,
  createContract,
  createUser,
  getChallenge,
  getFiles,
  getToken,
  singleUser,
  newAdmin,
  newAdminParams,
  removeMedia,
  stream,
  uploadVideo,
  uploadVideoFile,
  updateContract,
  updateUser,
  singleContract,
  getFilesByNFT,
  nftContract,
  nftProduct,
  getTokensByContractProduct,
  search
};
