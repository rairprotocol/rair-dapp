const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const config = require('../../config/index');
const gcp = require('../../integrations/gcp');
const { addPin, addFolder } = require('../../integrations/ipfsService')();
const log = require('../../utils/logger')(module);
const { textPurify } = require('../../utils/helpers');
const {
  generateThumbnails,
  getMediaData,
  convertToHLS,
  encryptFolderContents,
} = require('../../utils/ffmpegUtils');
const { vaultKeyManager, vaultAppRoleTokenManager } = require('../../vault');
const AppError = require('../../utils/errors/AppError');
const { redisPublisher } = require('../../services/redis');

const { baseUri } = config.rairnode;

module.exports = {
  hardcodedDemoData: async (req, res, next) => {
    req.context = {
      publicDemoOverride: true,
    };
    return next();
  },
  validateForDemo: async (req, res, next) => {
    if (!req?.file) {
      return next(new AppError('An error has occurred', 400));
    }
    if (req.file.size >= (500 * 1024 * 1024)) {
      return next(new AppError('You have exceeded the size limit of videos for tier of usage. Please remove existing videos to free up space or contact RAIR support to upgrade your subscription.', 400));
    }
    // Check that the user has an email setup
    if (!req.user.email) {
      return next(new AppError('Uploading a video with RAIR requires an email registered with our profile settings. Please use the user profile menu in the upper right corner to add your email address to your profile.', 400));
    }
    return next();
  },
  uploadMedia: async (req, res, next) => {
    // Get video information from the request's body
    const {
      title,
      description,
      category,
      demo = 'false',
      storage = 'gcp',
    } = req.body;
    let { offers } = req.body;

    let publicDemoOverride = false;
    if (req.context) {
      publicDemoOverride = req.context.publicDemoOverride;
    }

    // Get the user information
    const { publicAddress } = req.user;
    // Get the socket ID from the request's query

    // default value for parameter 'preset'.
    // Currently remains unchanged and is not used in frontend
    // available values: 'fast', 'faster', 'veryfast', 'ultrafast'
    // using this valuas saves encoding time at the expense of much lower quality.
    const { speed = 'ultrafast' } = req.query;

    let cid = '';
    let defaultGateway = '';
    let storageLink = '';

    const validData = await axios
      .get(`${baseUri}/api/upload/validate`, {
        params: {
          offers,
          category,
          demo,
          publicAddress,
          demoEndpoint: publicDemoOverride,
        },
      })
      .catch((error) => error);

    if (validData instanceof Error) return next(validData);

    try {
      if (storage === 'gcp') {
        gcp();
      }
    } catch (error) {
      return next(new AppError('Cannot initialize storage'));
    }

    const { ok } = validData.data;
    if (!ok) {
      return next(new AppError('Validation failed'));
    }
    offers = validData.data.offers;

    if (req.file) {
      try {
        // Send response because video was uploaded successfully
        //    any errors from now on are sent by socket
        res.json({ success: true, result: req.file.filename });
        const storageName = {
          ipfs: 'IPFS',
          gcp: 'Google Cloud',
        }[storage];
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'message',
          message: `Uploaded video ${req.file.originalname}`,
          address: publicAddress.toLowerCase(),
        }));
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Processing video',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 0],
        }));
        log.info(`Processing: ${req.file.originalname}`);
        log.info(`${req.file.originalname} generating thumbnails`);

        // Adds 'duration' to the req.file object
        await getMediaData(req.file);

        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Generating thumbnails',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 10],
        }));
        // Adds 'thumbnailName' to the req.file object
        // Generates a static webp thumbnail and an animated gif thumbnail
        // ONLY for videos
        await generateThumbnails(req.file);

        log.info(`${req.file.originalname} converting to stream`);
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Converting to stream',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 20],
        }));

        // Converts the file with FFMPEG
        // 35% socket update comes from here
        await convertToHLS(
          req.file,
          speed,
          publicAddress,
        );
        log.info('ffmpeg DONE: converted to stream.');

        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Encrypting',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 40],
        }));
        // % 40, 50 happen inside here
        const { exportedKey, totalEncryptedFiles } = await encryptFolderContents(
          req.file,
          ['ts'],
        );

        const rairJson = {
          title: textPurify.sanitize(title),
          mainManifest: 'stream.m3u8',
          uploader: publicAddress,
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
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Uploading files',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 50],
        }));

        // Storage function releases 60% notification
        switch (storage) {
          case 'ipfs':
            cid = await addFolder(
              req.file.destination,
              req.file.destinationFolder,
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
          default:
            // eslint-disable-next-line no-case-declarations
            const gcpService = gcp();
            cid = await gcpService.uploadDirectory(
              config.gcp.videoBucketName,
              req.file.destination,
            );
            if (!cid) {
              throw new Error('Directory upload failed');
            }
            defaultGateway = `${config.gcp.gateway}/${config.gcp.videoBucketName}/${cid}`;
            storageLink = defaultGateway;
            break;
        }
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Files uploaded',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 60],
        }));

        fs.rm(req.file.destination, { recursive: true }, (err) => {
          if (err) log.error(err);
        });
        log.info(
          `Temporary folder ${req.file.destinationFolder} with stream chunks was removed.`,
        );
        delete req.file.destination;

        const uploader = publicAddress;

        const meta = {
          mainManifest: 'stream.m3u8',
          uploader,
          encryptionType: 'aes-256-gcm',
          title: textPurify.sanitize(title),
          offers,
          category,
          staticThumbnail: `${
            req.file.type === 'video' ? `${defaultGateway}/` : ''
          }${req.file.staticThumbnail}`,
          animatedThumbnail: req.file.animatedThumbnail
            ? `${defaultGateway}/${req.file.animatedThumbnail}`
            : '',
          type: req.file.type,
          extension: req.file.extension,
          duration: req.file.duration,
          demo,
          totalEncryptedFiles,
          storage,
          storagePath: storageLink,
        };

        if (description) {
          meta.description = textPurify.sanitize(description);
        }

        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Storing stream data',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 70],
        }));
        log.info(`${req.file.originalname} storing to DB.`);

        const key = { ...exportedKey, key: exportedKey.key.toJSON() };

        await vaultKeyManager.write({
          secretName: cid,
          data: {
            uri: storageLink,
            key,
          },
          vaultToken: vaultAppRoleTokenManager.getToken(),
        });

        log.info('Key written to vault.');
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'uploadProgress',
          message: 'Storing stream data',
          address: publicAddress.toLowerCase(),
          data: [req.file.originalname, 80],
        }));

        const uploadData = await axios({
          method: 'POST',
          url: `${baseUri}/api/upload/file`,
          data: {
            cid,
            meta,
          },
        }).catch(log.error);

        if (uploadData?.data?.ok) {
          log.info(`${req.file.originalname} stored to DB.`);
          redisPublisher.publish('notifications', JSON.stringify({
            type: 'uploadProgress',
            message: 'Storing stream data',
            address: publicAddress.toLowerCase(),
            data: [req.file.originalname, ['gcp'].includes(storage) ? 100 : 90],
          }));

          log.info(`${req.file.originalname} pinning to ${storageName}.`);

          if (storage === 'ipfs') {
            await addPin(cid, title);
            redisPublisher.publish('notifications', JSON.stringify({
              type: 'uploadProgress',
              message: 'Storing stream data',
              address: publicAddress.toLowerCase(),
              data: [req.file.originalname, 90],
            }));
          }
        }
        return true;
      } catch (e) {
        log.error('An error has occurred encoding the file');
        redisPublisher.publish('notifications', JSON.stringify({
          type: 'message',
          message: `An error has occurred encoding the file ${req.file.originalname}`,
          address: publicAddress.toLowerCase(),
          data: [],
        }));
        log.error(e);
        return next();
      }
    } else {
      return next(new AppError('File not provided.', 400));
    }
  },
};
