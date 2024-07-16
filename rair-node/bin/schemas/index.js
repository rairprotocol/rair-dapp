const admin = require('./admin');
const addMedia = require('./addMedia');
const authentication = require('./authentication');
const createContract = require('./createContract');
const createUser = require('./createUser');
const getChallenge = require('./getChallenge');
const getChallengeV2 = require('./getChallengeV2');
const filterAndSort = require('./filterAndSort');
const getToken = require('./getToken');
const removeMedia = require('./removeMedia');
const updateMedia = require('./updateMedia');
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
const getLocksByProduct = require('./getLocksByProduct');
const getFilesByProduct = require('./getFilesByProduct');
const importContract = require('./importContract');
const { analyticsParams, analyticsQuery } = require('./analytics');
const { tokenCreditQuery, tokenCreditWithdraw } = require('./credits');
const { resaleQuery, resaleUpdate, resaleCreate } = require('./resales');
const { notificationsQuery } = require('./notifications');
// V2 validations
const textSearch = require('./textSearch');
const {
  validateMediaData,
  addFileFromMediaService,
} = require('./v2MediaFileSchemas');
const {
  v2Unlock,
  web3Validation,
} = require('./v2AuthSchemas');
const {
  csvFileUpload,
  getTokenNumbers,
  tokenNumber,
} = require('./v2TokenSchemas');
const {
  pagination,
  dbId,
  fileId,
  userAddress,
  resaleFlag,
  metadataSearch,
  tokenLimits,
} = require('./commonApiSchemas');
const {
  fullContracts,
  importExternalContracts,
} = require('./v2ContractSchemas');

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

  // Media files
  updateMedia,
  analyticsParams,
  analyticsQuery,

  // V2
  textSearch,

  // Import contract logic
  importContract,

  // user
  createUser,
  updateUser,

  // token
  updateTokenMetadata,
  updateCommonTokenMetadata,
  manageContract,
  getChallengeV2,
  withProductV2,

  // files
  getFilesByProduct,

  // lock
  getLocksByProduct,

  // favorites
  createFavoriteToken,

  // V2 Validation
  // Database schemas (using the Entity helper)
  ...require('./databaseSchemas'),
  // Media schemas
  validateMediaData,
  addFileFromMediaService,
  // Auth schemas
  v2Unlock,
  web3Validation,
  // Token Schemas
  csvFileUpload,
  getTokenNumbers,
  tokenNumber,

  // Notifications
  notificationsQuery,

  // Common schemas
  pagination,
  dbId,
  fileId,
  userAddress,
  resaleFlag,
  metadataSearch,
  tokenLimits,

  // Contract schemas
  fullContracts,
  importExternalContracts,

  // Credit system
  tokenCreditQuery,
  tokenCreditWithdraw,

  // V2 Resales
  resaleQuery,
  resaleUpdate,
  resaleCreate,
};
