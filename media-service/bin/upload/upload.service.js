const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const config = require('../config/index');
const gcp = require('../integrations/gcp')(config);
const { addPin, addFolder } = require('../integrations/ipfsService')();
const log = require('../utils/logger')(module);
const { textPurify, cleanStorage } = require('../utils/helpers');
const {
  generateThumbnails,
  getMediaData,
  convertToHLS,
  encryptFolderContents,
} = require('../utils/ffmpegUtils');
const { vaultKeyManager, vaultAppRoleTokenManager } = require('../vault');

const { baseUri } = config.rairnode;

module.exports = {
  uploadMedia: async (req, res, next) => {
    // Get video information from the request's body
    const {
      title,
      description,
      contract,
      product,
      offer = [],
      category,
      demo = 'false',
      storage = 'gcp',
    } = req.body;

    // Get the user information
    const { publicAddress, superAdmin } = req.user;
    // Get the socket ID from the request's query
    const { socketSessionId } = req.query;

    // default value for parameter 'preset'.
    // Currently remains unchanged and is not used in frontend
    // available values: 'fast', 'faster', 'veryfast', 'ultrafast'
    // using this valuas saves encoding time at the expense of much lower quality.
    const { speed = 'medium' } = req.query;

    let cid = '';
    let defaultGateway = '';
    let storageLink = '';

    const validData = await axios
      .get(`${baseUri}/api/v2/upload/validate`, {
        params: {
          contract,
          product,
          offer,
          category,
          demo,
        },
      })
      .catch((error) => error);

    if (validData instanceof Error) return next(validData);

    const { foundContract, foundCategory } = validData.data;

    const foundContractId = foundContract._id;

    if (foundContract.user !== publicAddress && !superAdmin) {
      return res.status(400).send({ success: false, message: `Contract ${contract} not belong to you.` });
    }

    // Get the socket connection from Express app

    const io = req.app.get('io');
    const sockets = req.app.get('sockets');
    const thisSocketId = sockets && socketSessionId ? sockets[socketSessionId] : null;
    const socketInstance = !_.isNull(thisSocketId)
      ? io.to(thisSocketId)
      : {
        emit: (eventName, eventData) => {
          log.info(
            `Dummy event: "${eventName}" socket emitter fired with message: "${eventData.message}" `,
          );
        },
      };

    if (req.file) {
      try {
        const storageName = {
          ipfs: 'IPFS',
          gcp: 'Google Cloud',
        }[storage];
        socketInstance.emit('uploadProgress', {
          message: 'File uploaded, processing data...',
          last: false,
          done: 5,
        });
        log.info(`Processing: ${req.file.originalname}`);
        log.info(`${req.file.originalname} generating thumbnails`);

        res.json({ success: true, result: req.file.filename });

        // Adds 'duration' to the req.file object
        await getMediaData(req.file);

        // Adds 'thumbnailName' to the req.file object
        // Generates a static webp thumbnail and an animated gif thumbnail
        // ONLY for videos
        await generateThumbnails(req.file, socketInstance);

        log.info(`${req.file.originalname} converting to stream`);
        socketInstance.emit('uploadProgress', {
          message: `${req.file.originalname} converting to stream`,
          last: false,
          done: 11,
        });

        // Converts the file with FFMPEG
        await convertToHLS(
          req.file,
          speed,
          socketInstance,
        );

        const exportedKey = await encryptFolderContents(
          req.file,
          ['ts'],
          socketInstance,
        );

        log.info('ffmpeg DONE: converted to stream.');

        const rairJson = {
          title: textPurify.sanitize(title),
          mainManifest: 'stream.m3u8',
          author: superAdmin ? foundContract.user : publicAddress,
          encryptionType: 'aes-256-gcm',
        };

        if (description) {
          rairJson.description = textPurify.sanitize(description);
        }

        fs.writeFileSync(
          `${req.file.destination}/rair.json`,
          JSON.stringify(rairJson, null, 4),
        );

        log.info(`${req.file.originalname} uploading to ${storageName}`);
        socketInstance.emit('uploadProgress', {
          message: `${req.file.originalname} uploading to ${storageName}`,
          last: false,
        });

        switch (storage) {
          case 'ipfs':
            cid = await addFolder(
              req.file.destination,
              req.file.destinationFolder,
              socketInstance,
            );
            defaultGateway = `${config.pinata.gateway}/${cid}`;
            storageLink = _.get(
              {
                ipfs: `${config.ipfs.gateway}/${cid}`,
                pinata: `${config.pinata.gateway}/${cid}`,
              },
              config.ipfsService,
              defaultGateway,
            );
            break;
          case 'gcp':
            cid = await gcp.uploadDirectory(
              config.gcp.videoBucketName,
              req.file.destination,
              socketInstance,
            );
            defaultGateway = `${config.gcp.gateway}/${config.gcp.videoBucketName}/${cid}`;
            storageLink = defaultGateway;
            break;
          default:
            // gcp -> default
            cid = await gcp.uploadDirectory(
              config.gcp.videoBucketName,
              req.file.destination,
              socketInstance,
            );
            defaultGateway = `${config.gcp.gateway}/${config.gcp.videoBucketName}/${cid}`;
            storageLink = defaultGateway;
            break;
        }

        fs.rm(req.file.destination, { recursive: true }, (err) => {
          if (err) log.error(err);
        });
        log.info(
          `Temporary folder ${req.file.destinationFolder} with stream chunks was removed.`,
        );
        delete req.file.destination;

        const meta = {
          mainManifest: 'stream.m3u8',
          authorPublicAddress: superAdmin ? foundContract.user : publicAddress,
          encryptionType: 'aes-256-gcm',
          title: textPurify.sanitize(title),
          contract: foundContractId,
          product,
          offer: demo === 'false' ? offer : [],
          category: foundCategory._id,
          staticThumbnail: `${
            req.file.type === 'video' ? `${defaultGateway}/` : ''
          }${req.file.staticThumbnail}`,
          animatedThumbnail: req.file.animatedThumbnail
            ? `${defaultGateway}/${req.file.animatedThumbnail}`
            : '',
          type: req.file.type,
          extension: req.file.extension,
          duration: req.file.duration,
          demo: demo === 'true',
        };

        if (description) {
          meta.description = textPurify.sanitize(description);
        }

        log.info(`${req.file.originalname} uploaded to ${storageName}: ${cid}`);
        socketInstance.emit('uploadProgress', {
          message: `uploaded to ${storageName}.`,
          last: false,
          done: 90,
        });

        log.info(`${req.file.originalname} storing to DB.`);
        socketInstance.emit('uploadProgress', {
          message: `${req.file.originalname} storing to database.`,
          last: false,
        });

        const key = { ...exportedKey, key: exportedKey.key.toJSON() };

        await vaultKeyManager.write({
          secretName: cid,
          data: {
            uri: storageLink,
            key,
          },
          vaultToken: vaultAppRoleTokenManager.getToken(),
        });

        log.info('Key wrote to vault.');

        await axios({
          method: 'POST',
          url: `${baseUri}/api/v2/upload/file`,
          data: {
            cid,
            meta,
          },
        });

        log.info(`${req.file.originalname} stored to DB.`);
        socketInstance.emit('uploadProgress', {
          message: 'Stored to database.',
          last: !!['gcp'].includes(storage),
          done: ['gcp'].includes(storage) ? 100 : 96,
        });

        log.info(`${req.file.originalname} pinning to ${storageName}.`);
        socketInstance.emit('uploadProgress', {
          message: `${req.file.originalname} pinning to ${storageName}.`,
          last: false,
        });

        if (storage === 'ipfs') {
          await addPin(cid, title, socketInstance);
        }
      } catch (e) {
        await cleanStorage(req.file);

        log.error('An error has occurred encoding the file');
        log.error(e);
      }
    } else {
      return res
        .status(400)
        .send({ success: false, message: 'File not provided.' });
    }
  },
};
