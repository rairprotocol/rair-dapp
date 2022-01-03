const streamDecrypter = require('./stream-decrypter');
const mongoose = require('mongoose');
const HLSServer = require('@rair/hls-server');
const log = require('./utils/logger')(module);

module.exports = async () => {
  const _mongoose = await mongoose.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((c) => {
      if (process.env.PRODUCTION === 'true') {
        log.info('DB Connected!');
      } else {
        log.info('Development DB Connected!');
      }
      return c;
    })
    .catch((e) => {
      log.error('DB Not Connected!');
      log.error(`Reason: ${e.message}`);
    });

  const File = _mongoose.model('File', require('./models/file'), 'File');

  return HLSServer({
    mediaConfigStore: async mediaId => (await File.findOne({ _id: mediaId })).toObject(),
    segmentTransformation: streamDecrypter,
    authCallback: req => req.token && req.token.media_id === req.mediaId
  });
};
