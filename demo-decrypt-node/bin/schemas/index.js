const admin = require('./admin');
const addMedia = require('./addMedia');
const authentication = require('./authentication');
const createTokenGroup = require('./createTokenGroup');
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
const updateTokenGroup = require('./updateTokenGroup');
const updateUser = require('./updateUser');
const singleTokenGroup = require('./singleTokenGroup');

module.exports = {
  admin,
  addMedia,
  authentication,
  createTokenGroup,
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
  updateTokenGroup,
  updateUser,
  singleTokenGroup
};
