const streamDecrypter = require('./stream-decrypter');
const mongoose = require('mongoose');
const HLSServer = require('@rair/hls-server');

module.exports = async () => {
  const _mongoose = await mongoose.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((c) => {
      if (process.env.PRODUCTION === 'true') {
        console.log('DB Connected!');
      } else {
        console.log('Development DB Connected!');
      }
      return c;
    })
    .catch((e) => {
      console.log('DB Not Connected!');
      console.log(`Reason: ${e.message}`);
    });

  const File = _mongoose.model('File', require('./models/file'), 'File');

  return HLSServer({
    mediaConfigStore: async mediaId => {
      const config = (await File.findOne({ _id: mediaId })).toObject();
      config.uri = process.env.IPFS_GATEWAY + '/' + mediaId;

      return config;
    },
    segmentTransformation: streamDecrypter,
    authCallback: req => req.token && req.token.media_id === req.mediaId
  });
};
