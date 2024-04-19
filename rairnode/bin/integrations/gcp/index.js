const { nanoid } = require('nanoid');
const fs = require('fs').promises;
const path = require('path');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger')(module);
const applicationConfig = require('../../shared_backend_code_generated/config/applicationConfig');
const {
  getAuthorizedStorageObject,
} = require('../../shared_backend_code_generated/integrations/gcp');

module.exports = (config) => {
  let storage;

  const { projectId, credentials } = config.gcp;
  try {
    if (projectId && credentials) {
      storage = getAuthorizedStorageObject({
        use_default_iam: applicationConfig.rairnode.useDefaultIamUserForFileManager,
        storageParams: { projectId },
        jsonCredentialsLocation: credentials,
      });
    }
  } catch (e) {
    log.error(e);
    throw new AppError('Authorized to GSP failed', 403);
  }

  const uploadFile = async (bucketName, file) => {
    if (!storage) {
      throw new AppError("Can't store image. Uninitialized", 500);
    }
    try {
      const bucket = storage.bucket(bucketName);
      const uploadData = await bucket.upload(file.path);

      return uploadData[0].metadata.name;
    } catch (e) {
      log.error(e.message);
      throw new AppError('Can\'t store image.', 500);
    }
  };

  const uploadFolder = async (bucketName, directoryPath, socketInstance) => {
    try {
      if (!storage) {
        throw new AppError("Can't store folder. Uninitialized", 500);
      }
      let dirCtr = 1;
      let itemCtr = 0;
      const fileList = [];

      const onComplete = async () => {
        const folderName = nanoid(46);

        await Promise.all(
          fileList.map((filePath) => {
            const fileName = path.relative(directoryPath, filePath);
            const destination = `${folderName}/${fileName}`;

            return storage
              .bucket(bucketName)
              .upload(filePath, { destination })
              .then(
                (uploadResp) => ({ fileName: destination, status: uploadResp[0] }),
                (err) => ({ fileName: destination, response: err }),
              );
          }),
        );

        if (socketInstance) {
          socketInstance.emit('uploadProgress', {
            message: 'Added files to Google bucket',
            last: false,
            part: false,
          });
        }

        return folderName;
      };

      const getFiles = async (directory) => {
        try {
          const items = await fs.readdir(directory);
          dirCtr--;
          itemCtr += items.length;
          // eslint-disable-next-line no-restricted-syntax
          for await (const item of items) {
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
        } catch (e) {
          log.error(e);
        }
      };

      await getFiles(directoryPath);

      return onComplete();
    } catch (e) {
      log.error(e.message);
      throw new AppError('Can\'t store folder.', 500);
    }
  };

  const removeFile = async (bucketName, file) => {
    try {
      if (!storage) {
        throw new AppError("Can't remove file. Uninitialized", 500);
      }
      const bucket = storage.bucket(bucketName);
      const response = await bucket.deleteFiles({
        prefix: file,
      });
      return {
        success: true,
        mediaId: file,
        response,
      };
    } catch (e) {
      log.error(e.message);
      return {
        success: false,
        mediaId: file,
        response: e,
      };
    }
  };

  return ({
    storage,
    uploadFile,
    uploadFolder,
    removeFile,
  });
};
