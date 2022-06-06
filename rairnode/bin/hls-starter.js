const streamDecrypter = require('./stream-decrypter');
const mongoose = require('mongoose');
const HLSServer = require('@rair/hls-server');
const log = require('./utils/logger')(module);

const {
  vaultKeyManager,
  vaultAppRoleTokenManager,
} = require('./vault');

const {
  mongoConnectionManager
} = require('./mongooseConnect');

module.exports = async () => {
  const _mongoose = await mongoConnectionManager.getMongooseConnection({});

  const File = _mongoose.model('File', require('./models/file'), 'File');

  const getMediaConfigStoreData = async (mediaId) => {
    // run the vault secret query in parallel
    // don't use it yet, we'll switch over to this later
    try {
      const vaultToken = vaultAppRoleTokenManager.getToken();
      const vaultRes = await vaultKeyManager.read({
        secretName: mediaId,
        vaultToken
      });
       console.log('vault res success', vaultRes);

    } catch(err) {
      // swallow error for now
      console.log('Error getting secret from vault', err);
      console.log('========', err)
    }

    const mongoRes = await File.findOne({ _id: mediaId });
    return mongoRes.toObject();
  }

  return HLSServer({
    mediaConfigStore: getMediaConfigStoreData,
    segmentTransformation: streamDecrypter,
    authCallback: req => req.session && req.session.media_id === req.mediaId
  });
};
