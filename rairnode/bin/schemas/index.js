const admin = require('./admin');
const addMedia = require('./addMedia');
const authentication = require('./authentication');
const createContract = require('./createContract');
const createUser = require('./createUser');
const getChallenge = require('./getChallenge');
const getChallengeV2 = require('./getChallengeV2');
const filterAndSort = require('./filterAndSort');
const getToken = require('./getToken');
const singleUser = require('./singleUser');
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
const updateTokenMetadata = require('./updateTokenMetadata');
const pinningMultiple = require('./pinningMultiple');
const updateCommonTokenMetadata = require('./updateCommonTokenMetadata');
const createFavoriteToken = require('./createFavoriteToken');
const withProductV2 = require('./withProductV2');
const manageContract = require('./manageContract');
const getProductsByUserAddress = require('./getProductsByUserAddress');
const getLocksByProduct = require('./getLocksByProduct');
const getFilesByProduct = require('./getFilesByProduct');

module.exports = {
  admin,
  addMedia,
  authentication,
  createContract,
  getChallenge,
  filterAndSort,
  getToken,
  removeMedia,
  stream,
  uploadVideo,
  uploadVideoFile,
  updateContract,
  singleContract,
  getFilesByNFT,
  nftContract,
  nftProduct,
  getTokensByContractProduct,
  search,
  pinningMultiple,
  // V2

  // user
  createUser,
  singleUser,
  updateUser,

  // token
  updateTokenMetadata,
  updateCommonTokenMetadata,
  manageContract,
  getChallengeV2,
  withProductV2,

  //product
  getProductsByUserAddress,

  //files
  getFilesByProduct,

  //lock
  getLocksByProduct,

  // favorites
  createFavoriteToken,

};
