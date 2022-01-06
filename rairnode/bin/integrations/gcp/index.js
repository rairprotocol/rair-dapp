const { Storage } = require('@google-cloud/storage');
const log = require('../../utils/logger')(module);

module.exports = config => {
  let storage = {};

  try {
    const credentials = JSON.parse(config.gcp.credentials);

    storage = new Storage({
      credentials,
      projectId: config.gcp.projectId,
    });
  } catch (e) {
    log.error(e);
  }


  const uploadFile = async (context, file) => {
    try {
      const bucket = storage.bucket(context.config.gcp.bucketName);
      const uploadData = await bucket.upload(file.path);

      return `https://storage.googleapis.com/${ bucket.name }/${ uploadData[0].metadata.name }`;
    } catch (e) {
      log.error(e.message);
      throw new Error('Can\'t store image.');
    }
  };

  return ({
    storage,
    uploadFile
  });
};
