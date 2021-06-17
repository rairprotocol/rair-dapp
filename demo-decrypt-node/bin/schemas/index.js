const admin = require('./admin');
const addMedia = require('./addMedia');
const authentication = require('./authentication');
const createUser = require('./createUser');
const getChallenge = require('./getChallenge');
const getToken = require('./getToken');
const getUser = require('./getUser');
const newAdmin = require('./newAdmin');
const newAdminParams = require('./newAdminParams');
const removeMedia = require('./removeMedia');
const stream = require('./stream');
const uploadVideo = require('./uploadVideo');
const uploadVideoFile = require('./uploadVideoFile');

module.exports = {
  admin,
  addMedia,
  authentication,
  createUser,
  getChallenge,
  getToken,
  getUser,
  newAdmin,
  newAdminParams,
  removeMedia,
  stream,
  uploadVideo,
  uploadVideoFile
};
