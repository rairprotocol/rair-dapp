const { Storage } = require('@google-cloud/storage');
const { nanoid } = require('nanoid');
const fs = require('fs').promises;
const path = require('path');
const log = require('../../utils/logger')(module);

module.exports = (config) => {
  let storage = {};

  try {
    const credentials = JSON.parse(config.gcp.credentials);

    storage = new Storage({
      credentials,
      projectId: config.gcp.projectId,
      retryOptions: {
        autoRetry: true,
        retryDelayMultiplier: 3,
        totalTimeout: 1000,
        maxRetryDelay: 180,
        maxRetries: 10,
      },
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

  const uploadDirectory = async (bucketName, directoryPath, socketInstance) => {
    try {
      let dirCtr = 1;
      let itemCtr = 0;
      const fileList = [];
      const size = 200;
      const groupsOffileList = [];

      const onComplete = async () => {
        const folderName = nanoid(46);
        let successfulUploads = 0;

        if (fileList.length < size) {
          await Promise.allSettled(
            fileList.map(async (filePath) => {
              try {
                const fileName = path.relative(directoryPath, filePath);
                const destination = `${folderName}/${fileName}`;

                await storage
                  .bucket(bucketName)
                  .upload(filePath, { destination })
                  .then(
                    (uploadResp) => ({ fileName: destination, status: uploadResp[0] }),
                  );
                successfulUploads += 1;
              } catch (e) {
                log.error(`Error uploading ${filePath}:`, e);
              }
            }),
          );
        } else {
          for (let i = 0; i < fileList.length; i += size) {
            groupsOffileList.push(fileList.slice(i, i + size));
          }

          for await (const groupOffileList of groupsOffileList) {
            await Promise.allSettled(
              groupOffileList.map(async (filePath) => {
                try {
                  const fileName = path.relative(directoryPath, filePath);
                  const destination = `${folderName}/${fileName}`;

                  await storage
                    .bucket(bucketName)
                    .upload(filePath, { destination })
                    .then(
                      (uploadResp) => ({ fileName: destination, status: uploadResp[0] }),
                    );
                  successfulUploads += 1;
                } catch (e) {
                  log.error(`Error uploading ${filePath}:`, e);
                }
              }),
            );
          }
        }

        if (socketInstance) {
          socketInstance.emit('uploadProgress', {
            message: `${successfulUploads} files added to ${folderName} and uploaded to Google Cloud successfully.`,
            last: false,
            part: false,
          });
        }

        return folderName;
      };

      const getFiles = async (directory) => {
        const items = await fs.readdir(directory);
        dirCtr -= 1;
        itemCtr += items.length;
        for (const item of items) {
          const fullPath = path.join(directory, item);
          const stat = await fs.stat(fullPath);
          itemCtr -= 1;
          if (stat.isFile()) {
            fileList.push(fullPath);
          } else if (stat.isDirectory()) {
            dirCtr += 1;
            await getFiles(fullPath);
          }
        }
      };
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
    uploadDirectory,
  });
};
