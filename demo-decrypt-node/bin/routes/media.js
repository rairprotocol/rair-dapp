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
      const { pageNum = '1', itemsPerPage = '20', sortBy = 'title', sort = '-1', blockchain = '', category = '' } = req.query;
      const searchQuery = {};
      const pageSize = parseInt(itemsPerPage, 10);
      const sortDirection = parseInt(sort, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;

      const foundCategory = await context.db.Category.findOne({ name: category });

      if (foundCategory) {
        searchQuery.category = foundCategory._id;
      }

      const foundBlockchain = await context.db.Blockchain.findOne({ name: blockchain });

      if (foundBlockchain) {
        const arrayOfContracts = await context.db.Contract.find({ blockchain: foundBlockchain.hash }).distinct('contractAddress');
        searchQuery.contract = { $in: arrayOfContracts };
      }

      const data = await context.db.File.find(searchQuery, { key: 0 })
        .skip(skip)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]]);

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

      res.json({ success: true, list });
    } catch (e) {
      log.error(e);
      next(e.message);
    }
  });

  router.post('/upload', upload.single('video'), JWTVerification(context), validation('uploadVideoFile', 'file'), formDataHandler, validation('uploadVideo'), async (req, res, next) => {
    console.log(req.file);
    // Get video information from the request's body
    const { title, description, contract, product, offer } = req.body;
    // Get the user information
    const { adminNFT: author, publicAddress } = req.user;
    // Get the socket ID from the request's query
    const { socketSessionId } = req.query;
    const reg = new RegExp(/^0x\w{40}:\w+$/);

    if (!author || !reg.test(author)) {
      return res.status(403).send({ success: false, message: 'You don\'t have permission to upload the files.' });
    }

    try {
      // Validate if user owns an Admin NFT
      const [contractAddress, tokenId] = author.split(':');
      const ownsTheAdminToken = await checkBalanceSingle(publicAddress, process.env.ADMIN_NETWORK, contractAddress, tokenId);

      if (!ownsTheAdminToken) {
        if (req.file) {
          fs.rm(req.file.destination, {recursive: true}, () => log.info('Exception handled, the folder has been deleted', e));
        }
        return res.status(403).send({ success: false, message: 'You don\'t hold the current admin token.' });
      }
    } catch (e) {
      if (req.file) {
        fs.rm(req.file.destination, {recursive: true}, () => log.info('Exception handled, the folder has been deleted', e));
      }
      log.error(`Could not verify account: ${ e }`);
      return next(new Error('Could not verify account.'));
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

    socketInstance.emit('uploadProgress', { message: 'File uploaded, processing data...', last: false, done: 5 });
    log.info(`Processing: ${ req.file.originalname }`);

    if (req.file) {
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
        title,
        mainManifest: 'stream.m3u8',
        author,
        encryptionType: 'aes-128-cbc'
      };

      if (description) {
        rairJson.description = description;
      }

      fs.writeFileSync(`${ req.file.destination }/rair.json`, JSON.stringify(rairJson, null, 4));

      log.info(`${ req.file.originalname } uploading to ipfsService`);
      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } uploading to ipfsService`,
        last: false
      });

      const ipfsCid = await addFolder(req.file.destination, req.file.destinationFolder, socketInstance);

      fs.rm(req.file.destination, {recursive: true}, console.log);
      log.info(`Temporary folder ${req.file.destinationFolder} with stream chunks was removed.`);

      const defaultGateway = `${ process.env.PINATA_GATEWAY }/${ ipfsCid }`;
      const gateway = {
        ipfs: `${ process.env.IPFS_GATEWAY }/${ ipfsCid }`,
        pinata: `${ process.env.PINATA_GATEWAY }/${ ipfsCid }`
      };

      const meta = {
        mainManifest: 'stream.m3u8',
        author,
        encryptionType: 'aes-128-cbc',
        title,
        contract,
        product,
        offer,
        staticThumbnail: `${req.file.type === 'video' ? `${defaultGateway}/` : ''}${req.file.staticThumbnail}`,
        animatedThumbnail: req.file.animatedThumbnail ? `${defaultGateway}/${req.file.animatedThumbnail}` : '',
        type: req.file.type,
        extension: req.file.extension,
        duration: req.file.duration
      };

      if (description) {
        meta.description = description;
      }

      log.info(`${ req.file.originalname } uploaded to ipfsService: ${ ipfsCid }`);
      socketInstance.emit('uploadProgress', { message: `uploaded to ipfsService.`, last: false, done: 90 });

      log.info(`${ req.file.originalname } storing to DB.`);
      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } storing to db.`,
        last: false
      });

      await context.db.File.create({
        _id: ipfsCid,
        key: exportedKey.toJSON(),
        uri: _.get(gateway, process.env.IPFS_SERVICE, defaultGateway),
        ...meta,
      });

      log.info(`${ req.file.originalname } stored to DB.`);
      socketInstance.emit('uploadProgress', { message: 'Stored to DB.', last: false, done: 96 });

      context.hls = StartHLS();

      log.info(`${ req.file.originalname } pinning to ipfsService.`);
      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } pinning to ipfsService.`,
        last: false
      });

      await addPin(ipfsCid, title, socketInstance);
    }
  });

  return router;
};
