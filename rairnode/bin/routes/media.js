const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const { retrieveMediaInfo, addPin, removePin, addFolder } = require('../integrations/ipfsService')();
const upload = require('../Multer/Config');
const {
  validation,
  isOwner,
  formDataHandler,
  isAdmin,
  requireUserSession,
  loadUserSession,
} = require('../middleware');
const log = require('../utils/logger')(module);
const {
  generateThumbnails,
  getMediaData,
  convertToHLS,
  encryptFolderContents,
} = require('../utils/ffmpegUtils');
const { vaultKeyManager, vaultAppRoleTokenManager } = require('../vault');
const { checkFileAccess } = require('../utils/helpers');
const config = require('../config/index');
const gcp = require('../integrations/gcp')(config);
const { textPurify } = require('../utils/helpers');
const {
  Blockchain,
  Category,
  Contract,
  File,
  Offer,
  OfferPool,
  Product,
  User,
} = require('../models');
const { ObjectId } = require('mongodb');

module.exports = () => {
  const router = express.Router();
  /**
   * @swagger
   *
   * /api/media/add/{mediaId}:
   *   post:
   *     description: Register a new piece of media.Optionally provide a decrypt key. Also pins the content in the provided IPFS store
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: mediaId
   *         description: The IPFS content identifier (CID) for a RAIR compatible media folder. Must contain a rair.json manifest.
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       description: A .key file containing the private key for this media stream in binary encoding
   *       required: false
   *       content:
   *         application/octet-stream:
   *           schema:
   *             type: string
   *             format: binary
   *     responses:
   *       200:
   *         description: Returns if added successfully
   */
  router.post(
    '/add/:mediaId',
    validation(['addMedia'], 'params'),
    async (req, res, next) => {
      const key = req.body.length > 0 ? req.body : undefined;
      const { mediaId } = req.params;

      // lookup in IPFS at CID for a rair.json manifest
      try {
        const meta = await retrieveMediaInfo(mediaId);

        await File.create({ _id: mediaId, key, ...meta });
        await addPin(mediaId, _.get(meta, 'title', 'New_pinned_file'));
        res.sendStatus(200);
      } catch (e) {
        next(
          new Error(
            `Cannot retrieve rair.json manifest for ${mediaId}. Check the CID is correct and is a folder containing a manifest. ${e}`,
          ),
        );
      }
    },
  );

  router.patch(
    '/update/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    validation(['updateMedia'], 'body'),
    isOwner(File),
    async (req, res, next) => {
      try {
        const { mediaId } = req.params;

        // eslint-disable-next-line no-unused-vars
        const { _id, ...cleanBody } = req.body;

        if (!req.user.adminRights) {
          // eslint-disable-next-line no-unused-vars
          const { contract, offer, product, demo, bodyForNonAdmins } = cleanBody;
          req.body = bodyForNonAdmins;
        }

        const updateRes = await File.updateOne({ _id: mediaId }, cleanBody);

        if (!updateRes.acknowledged) {
          return res.json({ success: false, message: 'An error has ocurred' });
        }
        if (updateRes.matchedCount === 1 && updateRes.modifiedCount === 0) {
          return res.json({ success: false, message: 'Nothing to update' });
        }
        log.info(`File with ID: ${mediaId}, was updated on DB.`);
        return res.json({ success: true });
      } catch (err) {
        return next(err);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/media/remove/{mediaId}:
   *   delete:
   *     description: Register a new piece of media. Optinally provide a decrypt key
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: mediaId
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Returns if media successfully found and deleted
   */
  router.delete(
    '/remove/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    isOwner(File),
    async (req, res, next) => {
      try {
        const { mediaId } = req.params;

        const fileData = await File.findOne({ _id: mediaId });

        let deleteResponse;
        if (!fileData.storage) {
          log.error(`Can't tell where media ID ${mediaId} is stored, will not unpin/delete from storage, just from DB`);
          deleteResponse = { success: true };
        } else {
          switch (fileData.storage) {
            case 'gcp':
              deleteResponse = await gcp.removeFile(config.gcp.videoBucketName, mediaId);
            break;
            case 'ipfs':
              deleteResponse = await removePin(mediaId);
            break;
            default:
              log.error(`Unknown storage type for media ID ${mediaId} : ${fileData.storage}`);
            break;
          }
        }

        if (deleteResponse.success) {
          await File.deleteOne({ _id: mediaId });
          log.info(`File with ID: ${mediaId}, was removed from DB.`);
          res.json({
            success: true,
          });
          return;
        }

        res.json({
          success: false,
          message: deleteResponse.response,
        });
      } catch (err) {
        next(err);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/media/list:
   *   get:
   *     description: List all the registered media, their URIs and encrypted status
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns a list of the currently registered media
   *         schema:
   *           type: object
   */
  router.get(
    '/list',
    validation(['filterAndSort', 'pagination'], 'query'),
    loadUserSession,
    async (req, res, next) => {
      try {
        const {
          pageNum = '1',
          itemsPerPage = '20',
          blockchain = '',
          category = [],
          userAddress = '',
          contractAddress = '',
          contractTitle = '',
          mediaTitle = '',
        } = req.query;
        const pageSize = parseInt(itemsPerPage, 10);
        const skip = (parseInt(pageNum, 10) - 1) * pageSize;

        const foundUser = await User.findOne({ publicAddress: userAddress });

        const foundBlockchain = await Blockchain.findOne({ hash: blockchain });
        const contractQuery = {
          blockView: false,
        };
        if (foundBlockchain) {
          contractQuery.blockchain = blockchain;
        }
        if (contractAddress) {
          contractQuery.contractAddress = contractAddress;
        }
        if (contractTitle) {
          contractQuery.title = { $regex: contractTitle, $options: 'i' };
        }
        const arrayOfContracts = await Contract.find(contractQuery).distinct(
          '_id',
        );
        const matchData = {
          $or: [{
            'unlockData.offers.contract': {
              $in: arrayOfContracts,
            },
          }, {
            demo: true,
          }],
        };

        if (category.length) {
          matchData.category = { $in: category.map((cat) => new ObjectId(cat)) };
        }

        if (foundUser) {
          matchData.uploader = userAddress;
        }

        if (mediaTitle !== '') {
          matchData.title = { $regex: mediaTitle, $options: 'i' };
        }

        const pipeline = [
          {
            $lookup: {
              from: 'Unlock',
              localField: '_id',
              foreignField: 'file',
              as: 'unlockData',
            },
          }, {
            $lookup: {
              from: 'Offer',
              localField: 'unlockData.offers',
              foreignField: '_id',
              as: 'unlockData.offers',
            },
          },
          {
            $match: matchData,
          },
          {
            $project: {
              key: false,
              encryptionType: false,
              totalEncryptedFiles: false,
              extension: false,
            },
          }, {
            $sort: {
              title: 1,
            },
          },
        ];

        let data = (await File.aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: pageSize },
        ]));

        const [countResult] = await File.aggregate([...pipeline, { $count: 'totalCount' }]);

        const { totalCount } = countResult || 0;

        // verify the user have needed tokens for unlock the files
        data = await checkFileAccess(data, req.user);

        const list = _.chain(data)
          .reduce((result, value) => {
          // eslint-disable-next-line no-param-reassign
            result[value._id] = value;
            return result;
          }, {})
          .value();

        return res.json({ success: true, list, totalNumber: totalCount });
      } catch (e) {
        log.error(e);
        return next(e.message);
      }
    },
  );

  router.post(
    '/upload',
    requireUserSession,
    isAdmin,
    upload.single('video'),
    validation(['uploadVideoFile'], 'file'),
    formDataHandler,
    validation(['uploadVideo']),
    async (req, res, next) => {
      // Get video information from the request's body
      const {
        title, description, contract, product, offer = [], category, demo = 'false', storage = 'ipfs',
      } = req.body;
      // Get the user information
      const { publicAddress, superAdmin } = req.user;
      // Get the socket ID from the request's query
      const { socketSessionId } = req.query;

      let cid = '';
      let defaultGateway = '';
      let storageLink = '';

      const foundContract = await Contract.findById(contract);

      if (!foundContract) {
        return next(new AppError(`Contract ${contract} not found.`, 404));
      }

      if (foundContract.user !== publicAddress && !superAdmin) {
        return next(new AppError(`Contract ${contract} not belong to you.`, 400));
      }

      const foundProduct = await Product.findOne({
        contract: foundContract._id,
        collectionIndexInContract: product,
      });

      if (!foundProduct) {
        return next(new AppError(`Product ${product} not found.`, 404));
      }

      const foundCategory = await Category.findOne({ name: category });

      if (!foundCategory) {
        return next(new AppError('Category not found.', 404));
      }

      // Diamond contracts have no offerPools
      const foundOfferPool = await OfferPool.findOne({
        contract: foundContract._id,
        product: foundProduct.collectionIndexInContract,
      });

      if (demo === 'false') {
        let foundOffers;
        if (foundContract?.diamond) {
          foundOffers = await Offer.find({ contract: foundContract._id, diamondRangeIndex: { $in: offer } }).distinct('diamondRangeIndex');
        } else {
          foundOffers = await Offer.find({ contract: foundContract._id, offerPool: foundOfferPool.marketplaceCatalogIndex, offerIndex: { $in: offer } }).distinct('offerIndex');
        }

        offer.forEach((item) => {
          if (!_.includes(foundOffers, item)) {
            return next(new AppError(`Offer ${item} not found.`, 404));
          }

          return true;
        });
      }

      // Get the socket connection from Express app
      const io = req.app.get('io');
      const sockets = req.app.get('sockets');
      const thisSocketId = sockets && socketSessionId ? sockets[socketSessionId] : null;
      const socketInstance = !_.isNull(thisSocketId) ? io.to(thisSocketId) : {
        emit: (eventName, eventData) => {
          log.info(`Dummy event: "${eventName}" socket emitter fired with message: "${eventData.message}" `);
        },
      };

      if (req.file) {
        try {
          const storageName = {
            ipfs: 'IPFS',
            gcp: 'Google Cloud',
          }[storage];
          socketInstance.emit('uploadProgress', { message: 'File uploaded, processing data...', last: false, done: 5 });
          log.info(`Processing: ${req.file.originalname}`);
          log.info(`${req.file.originalname} generating thumbnails`);

          res.json({ success: true, result: req.file.filename });

          // Adds 'duration' to the req.file object
          await getMediaData(req.file);

          // Adds 'thumbnailName' to the req.file object
          // Generates a static webp thumbnail and an animated gif thumbnail
          // ONLY for videos
          // TODO: make the verification for making thumbnails only for videos
          await generateThumbnails(req.file, socketInstance);

          log.info(`${req.file.originalname} converting to stream`);
          socketInstance.emit('uploadProgress', {
            message: `${req.file.originalname} converting to stream`,
            last: false,
            done: 11,
          });

          // Converts the file with FFMPEG
          await convertToHLS(req.file, socketInstance);

          const exportedKey = await encryptFolderContents(req.file, ['ts'], socketInstance);

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

          fs.writeFileSync(`${req.file.destination}/rair.json`, JSON.stringify(rairJson, null, 4));

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
              cid = await gcp.uploadFolder(
                config.gcp.videoBucketName,
                req.file.destination,
                socketInstance,
              );
              defaultGateway = `${config.gcp.gateway}/${config.gcp.videoBucketName}/${cid}`;
              storageLink = defaultGateway;
              break;
            default:
              // gcp -> default
              cid = await gcp.uploadFolder(
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
          log.info(`Temporary folder ${req.file.destinationFolder} with stream chunks was removed.`);
          delete req.file.destination;

          const meta = {
            mainManifest: 'stream.m3u8',
            uploader: superAdmin ? foundContract.user : publicAddress,
            encryptionType: 'aes-256-gcm',
            title: textPurify.sanitize(title),
            contract: foundContract._id,
            product,
            offer: demo === 'false' ? offer : [],
            category: foundCategory._id,
            staticThumbnail: `${req.file.type === 'video' ? `${defaultGateway}/` : ''}${req.file.staticThumbnail}`,
            animatedThumbnail: req.file.animatedThumbnail ? `${defaultGateway}/${req.file.animatedThumbnail}` : '',
            type: req.file.type,
            extension: req.file.extension,
            duration: req.file.duration,
            demo: demo === 'true',
          };

          if (description) {
            meta.description = textPurify.sanitize(description);
          }

          log.info(`${req.file.originalname} uploaded to ${storageName}: ${cid}`);
          socketInstance.emit('uploadProgress', { message: `uploaded to ${storageName}.`, last: false, done: 90 });

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

          await File.create({
            _id: cid,
            ...meta,
          });

          log.info(`${req.file.originalname} stored to DB.`);
          socketInstance.emit('uploadProgress', { message: 'Stored to database.', last: !!['gcp'].includes(storage), done: ['gcp'].includes(storage) ? 100 : 96 });

          log.info(`${req.file.originalname} pinning to ${storageName}.`);
          socketInstance.emit('uploadProgress', {
            message: `${req.file.originalname} pinning to ${storageName}.`,
            last: false,
          });

          if (storage === 'ipfs') await addPin(cid, title, socketInstance);
        } catch (e) {
          if (req.file.destination) {
            fs.rm(req.file.destination, { recursive: true }, (err) => {
              if (err) log.error(err);
            });
          }

          log.error('An error has occurred encoding the file', e);
          return next(new AppError('There was an error encoding your file.', 500));
        }
      } else {
        return next(new AppError('File not provided.', 400));
      }
    },
  );

  return router;
};
