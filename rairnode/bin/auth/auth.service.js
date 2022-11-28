const jwt = require('jsonwebtoken');
const axios = require('axios');
// const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const log = require('../utils/logger')(module);
const { File } = require('../models');

const { zoomSecret, zoomClientID } = require('../config');

module.exports = {
  authToZoom: async (req, res, next) => {
    try {
      // JWT creation deprecated on June 2023
      const payload = {
        iss: zoomClientID,
        exp: new Date().getTime() + 5000,
      };
      const token = jwt.sign(payload, zoomSecret);
      // ... replace with Oauth

      // Do not use findOne - this will lead to positive result in case mediaID=''
      // To work this requires auth with /get_token/:MetaMessage/:MetaSignature/:mediaId
      // This is the most secure way as user won't be able to change mediaID in request
      // As well this quarantee that user is authorized, as there is a valid session
      const { meetingId } = File.findById(req.session.mediaId);
      // Challenging Zoom for meeting invitation link
      const respond = await axios.get({
        uri: `https://api.zoom.us/v2/meetings/${meetingId}/invitation`,
        auth: {
          bearer: token,
        },
      });
      return res.json(respond);
    } catch (err) {
      log.error(err);
      return next(err);
    }
  },
};
