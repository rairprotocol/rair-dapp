const { Storage } = require('@google-cloud/storage');
const { nanoid } = require('nanoid');
const fs = require('fs').promises;
const path = require('path');
const log = require('../../utils/logger')(module);
const applicationConfig = require('../../shared_backend_code_generated/config/applicationConfig');
const {
  getAuthorizedStorageObject
} = require('../../shared_backend_code_generated/integrations/gcp')



module.exports = config => {
  let storage = {};

  try {
    let storageParams = {
      projectId: config.gcp.projectId,
    };

    storage = getAuthorizedStorageObject({
      use_default_iam: applicationConfig["rairnode"].useDefaultIamUserForFileManager,
      storageParams,
      jsonCredentialsLocation: config.gcp.credentials
    });

  } catch (e) {
    log.error(e);
  }


  const uploadFile = async (bucketName, file) => {
    try {
      const bucket = storage.bucket(bucketName);
      const uploadData = await bucket.upload(file.path);

      return uploadData[0].metadata.name;
    } catch (e) {
      log.error(e.message);
      throw new Error('Can\'t store image.');
    }
  };

  const uploadFolder = async (bucketName, directoryPath, socketInstance) => {
    try {
      let dirCtr = 1;
      let itemCtr = 0;
      const fileList = [];

      const onComplete = async () => {
        const folderName = nanoid(46);

        await Promise.all(
          fileList.map(filePath => {
            const fileName = path.relative(directoryPath, filePath);
            const destination = `${ folderName }/${ fileName }`;

            return storage
              .bucket(bucketName)
              .upload(filePath, { destination })
              .then(
                uploadResp => ({ fileName: destination, status: uploadResp[0] }),
                err => ({ fileName: destination, response: err })
              );
          })
        );

        if (socketInstance) socketInstance.emit('uploadProgress', {
          message: `Added files to Google bucket`,
          last: false,
          part: false
        });

        return folderName;
      };

      const getFiles = async directory => {
        const items = await fs.readdir(directory);
        dirCtr--;
        itemCtr += items.length;
        for(const item of items) {
          const fullPath = path.join(directory, item);
          const stat = await fs.stat(fullPath);
          itemCtr--;
          if (stat.isFile()) {
            fileList.push(fullPath);
          } else if (stat.isDirectory()) {
            dirCtr++;
            await getFiles(fullPath);
          }
        }
      }

      await getFiles(directoryPath);

      return onComplete();
    } catch (e) {
      log.error(e.message);
      throw new Error('Can\'t store folder.');
    }
  };

  return ({
    storage,
    uploadFile,
    uploadFolder,
  });
};
