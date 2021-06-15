const admin = require('./admin');
const authentication = require('./authentication');
const createUser = require('./createUser');
const getChallenge = require('./getChallenge');
const getToken = require('./getToken');
const getUser = require('./getUser');
const newAdmin = require('./newAdmin');
const newAdminParams = require('./newAdminParams');
const uploadVideo = require('./uploadVideo');

module.exports = {
  admin,
  authentication,
  createUser,
  getChallenge,
  getToken,
  getUser,
  newAdmin,
  newAdminParams,
  uploadVideo
};
