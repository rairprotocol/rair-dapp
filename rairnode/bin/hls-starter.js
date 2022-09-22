// const HLSServer = require('@rair/hls-server');
const AppError = require('./utils/errors/AppError');
const HLSServer = require('./utils/hls-server');
const streamDecrypter = require('./stream-decrypter');
const { File } = require('./models');

const { vaultKeyManager, vaultAppRoleTokenManager } = require('./vault');

module.exports = async () => {
  const getMediaConfigStoreData = async (mediaId) => {
    // run the vault secret query
    const vaultToken = vaultAppRoleTokenManager.getToken();
    const vaultRes = await vaultKeyManager.read({
      secretName: mediaId,
      vaultToken,
    }).catch((e) => new AppError(`Vault error: ${e}`, 503));

    const mongoRes = await File.findOne({ _id: mediaId });

    if (mongoRes) {
      const fileData = mongoRes.toObject();

      if (vaultRes) {
        return { ...fileData, ...vaultRes };
      }

      return fileData;
    }

    return new AppError('File not found.', 404);
  };

  return HLSServer({
    mediaConfigStore: getMediaConfigStoreData,
    segmentTransformation: streamDecrypter,
    authCallback: (req) => req.session && req.session.media_id === req.mediaId,
  });
};
