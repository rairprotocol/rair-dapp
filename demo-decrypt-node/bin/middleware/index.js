const JWTVerification = require('./JWTVerification');
const validation = require('./validation');
const isOwner = require('./isOwner');
const formDataHandler = require('./formDataHandler');

module.exports = {
  JWTVerification,
  validation,
  isOwner,
  formDataHandler
}
