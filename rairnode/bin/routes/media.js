const express = require('express');
const { retrieveMediaInfo, addPin, removePin, addFolder } = require('../integrations/ipfsService')();
const upload = require('../Multer/Config.js');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const StartHLS = require('../hls-starter.js');
const _ = require('lodash');
const { JWTVerification, validation, isOwner, formDataHandler } = require('../middleware');
const log = require('../utils/logger')(module);
//const { execPromise } = require('../utils/helpers');
const { checkBalanceSingle } = require('../integrations/ethers/tokenValidation.js');
const { generateThumbnails, getMediaData, convertToHLS, encryptFolderContents } = require('../utils/ffmpegUtils.js');
const { vaultKeyManager } = require('../vault/vaultKeyManager');
const { vaultAppRoleTokenManager } = require('../vault/vaultAppRoleTokenManager');

module.exports = context => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/media/add/{mediaId}:
   *   post:
   *     description: Register a new piece of media. Optionally provide a decrypt key. Also pins the content in the provided IPFS store
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
  router.post('/add/:mediaId', validation('addMedia', 'params'), async (req, res, next) => {
    const key = req.body.length > 0 ? req.body : undefined;
    const mediaId = req.params.mediaId;

    // lookup in IPFS at CID for a rair.json manifest
    try {
      const meta = await retrieveMediaInfo(mediaId);
      await context.db.File.create({ _id: mediaId, key, ...meta });
      await addPin(mediaId, _.get(meta, 'title', 'New_pinned_file'));
      res.sendStatus(200);
    } catch (e) {
      next(new Error(`Cannot retrieve rair.json manifest for ${ mediaId }. Check the CID is correct and is a folder containing a manifest. ${ e }`));
    }
  });

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
  router.delete('/remove/:mediaId', JWTVerification(context), validation('removeMedia', 'params'), isOwner(context), async (req, res, next) => {
    try {
      const mediaId = req.params.mediaId;

      await context.db.File.deleteOne({ _id: mediaId });

      log.info(`File with ID: ${ mediaId }, was removed from DB.`);

      // unpin from ipfsService
      await removePin(mediaId);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  });

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
  router.get('/list', /*JWTVerification(context),*/ validation('filterAndSort', 'query'), async (req, res, next) => {
    try {
      const { pageNum = '1', itemsPerPage = '20', blockchain = '', category = '' } = req.query;
      const searchQuery = {};
      const pageSize = parseInt(itemsPerPage, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;

      const foundCategory = await context.db.Category.findOne({ name: category });

      if (foundCategory) {
        searchQuery.category = foundCategory._id;
      }

      const foundBlockchain = await context.db.Blockchain.findOne({ hash: blockchain });

      if (foundBlockchain) {
        const arrayOfContracts = await context.db.Contract.find({ blockchain }).distinct('_id');
        searchQuery.contract = { $in: arrayOfContracts };
      }

      const data = await context.db.File.find(searchQuery, { key: 0 })
        .sort({ title: 1 })
        .skip(skip)
        .limit(pageSize);

      // const { adminNFT: author } = req.user;
      // const reg = new RegExp(/^0x\w{40}:\w+$/);

      const list = _.chain(data)
        // .map(file => {
        //   const clonedFile = _.assign({}, file.toObject());
        //
        //   clonedFile.isOwner = !!(author && reg.test(author) && author === clonedFile.author);
        //
        //   return clonedFile;
        // })
        .reduce((result, value) => {
          result[value._id] = value;
          return result;
        }, {})
        .value();

      return res.json({ success: true, list });
    } catch (e) {
      log.error(e);
      next(e.message);
    }
  });

  router.post('/upload', upload.single('video'), JWTVerification(context), validation('uploadVideoFile', 'file'), formDataHandler, validation('uploadVideo'), async (req, res, next) => {
    // Get video information from the request's body
    const { title, description, contract, product, offer = [], category, demo = 'false', storage = 'ipfs' } = req.body;
    // Get the user information
    const { adminNFT: author, adminRights, publicAddress } = req.user;
    // Get the socket ID from the request's query
    const { socketSessionId } = req.query;
    const { db, config } = context;
    let cid = '';
    let defaultGateway = '';
    let storageLink = '';

    if (!adminRights) {
      if (req.file) {
        fs.rm(req.file.destination, {recursive: true}, (err) => {
          log.info(`User ${publicAddress} don\'t have permission to upload the files.`)

          if (err) log.error(err);
        });
      }
      return res.status(403).send({ success: false, message: 'You don\'t have permission to upload the files.' });
    }

    const foundContract = await db.Contract.findById(contract);

    if (!foundContract) {
      return res.status(404).send({ success: false, message: `Contract ${ contract } not found.` });
    }

    const foundProduct = await db.Product.findOne({ contract: foundContract._id, collectionIndexInContract: product });

    if (!foundProduct) {
      return res.status(404).send({ success: false, message: `Product ${ product } not found.` });
    }

    const foundCategory = await db.Category.findOne({ name: category });

    if (!foundCategory) {
      return res.status(404).send({ success: false, message: 'Category not found.' });
    }

    const foundOfferPool = await db.OfferPool.findOne({ contract: foundContract._id, product: foundProduct.collectionIndexInContract });

    if (demo === 'false') {
      const foundOffers = await db.Offer.find({ contract: foundContract._id, offerPool: foundOfferPool.marketplaceCatalogIndex, offerIndex: { $in: offer } }).distinct('offerIndex');

      offer.forEach(item => {
        if (!_.includes(foundOffers, item)) {
          return res.status(404).send({ success: false, message: `Offer ${ item } not found.` });
        }
      })
    }

    // Get the socket connection from Express app
    const io = req.app.get('io');
    const sockets = req.app.get('sockets');
    const thisSocketId = sockets && socketSessionId ? sockets[socketSessionId] : null;
    const socketInstance = !_.isNull(thisSocketId) ? io.to(thisSocketId) : {
      emit: (eventName, eventData) => {
        log.info(`Dummy event: "${ eventName }" socket emitter fired with message: "${ eventData.message }" `);
      }
    };

    if (req.file) {
      try {
        let storageName = {
          'ipfs': 'IPFS',
          'gcp': 'Google Cloud'
        }[storage];
        socketInstance.emit('uploadProgress', { message: 'File uploaded, processing data...', last: false, done: 5 });
        log.info(`Processing: ${ req.file.originalname }`);
        log.info(`${ req.file.originalname } generating thumbnails`);

        res.json({ success: true, result: req.file.filename });

        // Adds 'duration' to the req.file object
        await getMediaData(req.file);

        // Adds 'thumbnailName' to the req.file object
        // Generates a static webp thumbnail and an animated gif thumbnail
        // ONLY for videos
        await generateThumbnails(req.file, socketInstance);

        log.info(`${ req.file.originalname } converting to stream`);
        socketInstance.emit('uploadProgress', {
          message: `${ req.file.originalname } converting to stream`,
          last: false,
          done: 11
        });

        // Converts the file with FFMPEG
        await convertToHLS(req.file, socketInstance);

        const exportedKey = await encryptFolderContents(req.file, ['ts'], socketInstance);

        log.info('ffmpeg DONE: converted to stream.');

        const rairJson = {
          title: context.textPurify.sanitize(title),
          mainManifest: 'stream.m3u8',
          author,
          encryptionType: 'aes-256-gcm'
        };

        if (description) {
          rairJson.description = context.textPurify.sanitize(description);
        }

        fs.writeFileSync(`${ req.file.destination }/rair.json`, JSON.stringify(rairJson, null, 4));

        log.info(`${ req.file.originalname } uploading to ${storageName}`);
        socketInstance.emit('uploadProgress', {
          message: `${ req.file.originalname } uploading to ${storageName}`,
          last: false
        });

        switch (storage) {
          case 'ipfs':
            cid = await addFolder(req.file.destination, req.file.destinationFolder, socketInstance);
            defaultGateway = `${ config.pinata.gateway }/${ cid }`;
            const gateway = {
              ipfs: `${ config.ipfs.gateway }/${ cid }`,
              pinata: `${ config.pinata.gateway }/${ cid }`
            };
            storageLink = _.get(gateway, config.ipfsService, defaultGateway);
            break;
          case 'gcp':
            cid = await context.gcp.uploadFolder(config.gcp.videoBucketName, req.file.destination, socketInstance);
            defaultGateway = `${ config.gcp.gateway }/${ config.gcp.videoBucketName }/${ cid }`;
            storageLink = defaultGateway;
            break;
        }

        fs.rm(req.file.destination, {recursive: true}, (err) => {
          if (err) log.error(err);
        });
        log.info(`Temporary folder ${req.file.destinationFolder} with stream chunks was removed.`);
        delete req.file.destination;

        const meta = {
          mainManifest: 'stream.m3u8',
          author,
          encryptionType: 'aes-256-gcm',
          title: context.textPurify.sanitize(title),
          contract: foundContract._id,
          product,
          offer: demo === 'false' ? offer : [],
          category: foundCategory._id,
          staticThumbnail: `${req.file.type === 'video' ? `${defaultGateway}/` : ''}${req.file.staticThumbnail}`,
          animatedThumbnail: req.file.animatedThumbnail ? `${defaultGateway}/${req.file.animatedThumbnail}` : '',
          type: req.file.type,
          extension: req.file.extension,
          duration: req.file.duration,
          demo: demo === 'true'
        };

        if (description) {
          meta.description = context.textPurify.sanitize(description);
        }

        log.info(`${ req.file.originalname } uploaded to ${storageName}: ${ cid }`);
        socketInstance.emit('uploadProgress', { message: `uploaded to ${storageName}.`, last: false, done: 90 });

        log.info(`${ req.file.originalname } storing to DB.`);
        socketInstance.emit('uploadProgress', {
          message: `${ req.file.originalname } storing to database.`,
          last: false
        });

        const key = { ...exportedKey, key: exportedKey.key.toJSON()};

        await db.File.create({
          _id: cid,
          key,
          uri: storageLink,
          ...meta,
        });

        try {
          const vaultWriteRes = await vaultKeyManager.write({
            secretName: cid,
            data: {
              uri: storageLink,
              key
            },
            vaultToken: vaultAppRoleTokenManager.getToken()
          })
        } catch(err) {
          console.log('Error writing key to vault:', cid);
        }

        log.info(`${ req.file.originalname } stored to DB.`);
        socketInstance.emit('uploadProgress', { message: 'Stored to database.', last: ['gcp'].includes(storage) ? true : false, done: ['gcp'].includes(storage) ? 100 : 96 });

        // context.hls = StartHLS();

        log.info(`${ req.file.originalname } pinning to ${storageName}.`);
        socketInstance.emit('uploadProgress', {
          message: `${ req.file.originalname } pinning to ${storageName}.`,
          last: false
        });

        if (storage === 'ipfs') await addPin(cid, title, socketInstance);
      } catch (e) {
        if (req.file.destination) {
          fs.rm(req.file.destination, {recursive: true}, (err) => {
            log.error('An error has occurred encoding the file', e);

            if (err) log.error(err);
          });
        } else {
          log.error(e);
        }
      }
    } else {
      return res.status(400).send({ success: false, message: 'File not provided.' });
    }
  });

  return router;
};
