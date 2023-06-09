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
// V2 validations
const {
  dbContracts,
  dbProducts,
  dbTokens,
  dbOffers,
  dbResales,
  dbRoyalties,
} = require('./databaseSchemas');
const textSearch = require('./textSearch');
const {
  validateMediaData,
  addFileFromMediaService,
} = require('./v2MediaFileSchemas');
const {
  v2Unlock,
  web3Validation,
  oreIdValidation,
} = require('./v2AuthSchemas');
const {
  csvFileUpload,
  getTokenNumbers,
  tokenNumber,
} = require('./v2TokenSchemas');
const {
  pagination,
  dbId,
  productId,
  offerId,
  userId,
  userAddress,
} = require('./commonApiSchemas');
const {
  fullContracts,
  importExternalContracts,
  specificContracts,
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
  singleUser,
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
  dbContracts,
  dbProducts,
  dbTokens,
  dbOffers,
  dbResales,
  dbRoyalties,
  // Media schemas
  validateMediaData,
  addFileFromMediaService,
  // Auth schemas
  v2Unlock,
  web3Validation,
  oreIdValidation,
  // Token Schemas
  csvFileUpload,
  getTokenNumbers,
  tokenNumber,

  // Common schemas
  pagination,
  dbId,
  productId,
  offerId,
  userId,
  userAddress,

  // Contract schemas
  fullContracts,
  importExternalContracts,
  specificContracts,

  // Credit system
  tokenCreditQuery,
  tokenCreditWithdraw,

};
