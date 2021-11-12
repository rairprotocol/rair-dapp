const express = require('express');
const { retrieveMediaInfo, addPin, removePin, addFolder } = require('../integrations/ipfsService')();
const upload = require('../Multer/Config.js');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const StartHLS = require('../hls-starter.js');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { JWTVerification, validation, isOwner, formDataHandler } = require('../middleware');
const log = require('../utils/logger')(module);
const { execPromise } = require('../utils/helpers');
const { checkBalanceSingle } = require('../integrations/ethers/tokenValidation.js');

const rareify = async (fsRoot, socketInstance) => {
  // Generate a key
  const key = crypto.generateKeySync('aes', { length: 128 });

  fs.writeFileSync(fsRoot + '/.key', key.export());

  const promiseList = [];

  log.info(`Rareifying: ${ fsRoot }`);

  // Encrypting .ts files
  for await (const entry of readdirp(fsRoot)) {
    const { fullPath, basename } = entry;
    if (path.extname(basename) === '.ts') {
      const promise = new Promise((resolve, reject) => {
        const encryptedPath = fullPath + '.encrypted';

        try {
          const iv = intToByteArray(parseInt(basename.match(/([0-9]+).ts/)[1]));
          const encrypt = crypto.createCipheriv('aes-128-cbc', key, iv);
          const source = fs.createReadStream(fullPath);
          const dest = fs.createWriteStream(encryptedPath);
          source.pipe(encrypt).pipe(dest).on('finish', () => {
            // overwrite the unencrypted file so we don't have to modify the manifests
            fs.renameSync(encryptedPath, fullPath);
            resolve(true);
            log.info(`finished encrypting: ${ entry.path }`);

            socketInstance.emit('uploadProgress', {
              message: `finished encrypting ${ entry.path }`,
              last: false,
              part: true
            });

          });
        } catch (e) {
          log.error('Could not encrypt', fullPath, e);
          reject(e);
        }
      });
      promiseList.push(promise);
    }
  }
  log.info(`Done scheduling encryptions, ${ promiseList.length } promises for ${ readdirp(fsRoot).length } files`);

  socketInstance.emit('uploadProgress', {
    message: `Done scheduling encryptions, ${ promiseList.length } promises for ${ readdirp(fsRoot).length } files`,
    last: false,
    done: 15,
    parts: promiseList.length
  });

  return await Promise.all(promiseList)
    .then(_ => {
      log.info('RAIR-ification successful! The root directory is ready to be uploaded to IPFS.');
      return key.export();
    });
};

/**
 * intToByteArray Convert an integer to a 16 byte Uint8Array (little endian)
 */
function intToByteArray(num) {
  var byteArray = new Uint8Array(16);
  for (var index = 0; index < byteArray.length; index++) {
    var byte = num & 0xff;
    byteArray[index] = byte;
    num = (num - byte) / 256;
  }
  return byteArray;
}

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
      await context.store.addMedia(mediaId, { key, ...meta });
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

      await context.store.removeMedia(mediaId);
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
  router.get('/list', JWTVerification(context), validation('getFiles', 'query'), async (req, res, next) => {
    try {
      const { pageNum = '1', filesPerPage = '10', sortBy = 'creationDate', sort = '-1', searchString } = req.query;

      const searchQuery = searchString ? { $text: { $search: searchString } } : {};
      const pageSize = parseInt(filesPerPage, 10);
      const sortDirection = parseInt(sort, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;
      const data = await context.db.File.find(searchQuery, { key: 0 })
        .skip(skip)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]]);

      const { adminNFT: author } = req.user;
      const reg = new RegExp(/^0x\w{40}:\w+$/);

      const list = _.chain(data)
        .map(file => {
          const clonedFile = _.assign({}, file.toObject());

          clonedFile.isOwner = !!(author && reg.test(author) && author === clonedFile.author);

          return clonedFile;
        })
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
    const { title, description, contract, product, offer } = req.body;
    const { adminNFT: author, publicAddress } = req.user;
    const { socketSessionId } = req.query;
    const reg = new RegExp(/^0x\w{40}:\w+$/);

    if (!author || !reg.test(author)) {
      return res.status(403).send({ success: false, message: 'You don\'t have permission to upload the files.' });
    }

    const foundContract = await context.db.Contract.findById(contract);

    if (!foundContract) {
      return res.status(404).send({ success: false, message: `Contract ${ contract } not found.` });
    }

    const foundProduct = await context.db.Product.findOne({ contract: foundContract._id, collectionIndexInContract: product });

    if (!foundProduct) {
      return res.status(404).send({ success: false, message: `Product ${ product } not found.` });
    }

    const foundOfferPool = await context.db.OfferPool.findOne({ contract: foundContract._id, product: foundProduct.collectionIndexInContract });

    const foundOffers = await context.db.Offer.find({ contract: foundContract._id, offerPool: foundOfferPool.marketplaceCatalogIndex, offerIndex: { $in: offer } }).distinct('offerIndex');

    offer.forEach(item => {
      if (!_.includes(foundOffers, item)) {
        return res.status(404).send({ success: false, message: `Offer ${ item } not found.` });
      }
    })

    try {
      const [contractAddress, tokenId] = author.split(':');
      const ownsTheAdminToken = await checkBalanceSingle(publicAddress, process.env.ADMIN_NETWORK, contractAddress, tokenId);

      if (!ownsTheAdminToken) {
        if (req.file) await execPromise(`rm -f ${ req.file.path }`);

        return res.status(403).send({ success: false, message: 'You don\'t hold the current admin token.' });
      }
    } catch (e) {
      if (req.file) await execPromise(`rm -f ${ req.file.path }`);

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
      let command = `pwd && mkdir ${ req.file.destination }stream${ req.file.filename }/`;
      await execPromise(command);

      log.info(`${ req.file.originalname } generating thumbnails`);

      command = `ffmpeg -ss 3 -i ${ req.file.path } -vf "select=gt(scene,0.5)" -vf "scale=144:-1" -vsync vfr -frames:v 1 ${ req.file.destination }Thumbnails/${ req.file.filename }.png && ffmpeg -i ${ req.file.path } -vf  "scale=144:-1" -ss 00:10 -t 00:03 ${ req.file.destination }Thumbnails/${ req.file.filename }.gif`;
      await execPromise(command);

      res.json({ success: true, result: req.file.filename });

      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } generating thumbnails`,
        last: false,
        done: 10
      });

      log.info(`${ req.file.originalname } converting to stream`);
      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } converting to stream`,
        last: false,
        done: 11
      });

      command = `ffmpeg -i ${ req.file.path } -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${ req.file.destination }stream${ req.file.filename }/stream.m3u8`;
      await execPromise(command, { maxBuffer: 1024 * 1024 * 20 });

      const exportedKey = await rareify(`${ req.file.destination }stream${ req.file.filename }`, socketInstance);

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

      fs.writeFileSync(`${ req.file.destination }stream${ req.file.filename }/rair.json`, JSON.stringify(rairJson, null, 4));

      command = `rm -f ${ req.file.path }`;
      await execPromise(command);

      log.info(`${ req.file.originalname } raw deleted`);
      socketInstance.emit('uploadProgress', { message: `${ req.file.originalname } raw deleted`, last: false });

      log.info(`${ req.file.originalname } uploading to ipfsService`);
      socketInstance.emit('uploadProgress', {
        message: `${ req.file.originalname } uploading to ipfsService`,
        last: false
      });

      command = `rm ${ req.file.destination }stream${ req.file.filename }/.key`;
      await execPromise(command);

      log.info(`${ req.file.destination }stream${ req.file.filename }/.key file was removed.`);

      const ipfsCid = await addFolder(`${ req.file.destination }stream${ req.file.filename }/`, `stream${ req.file.filename }`, socketInstance);

      command = `rm -r ${ req.file.destination }stream${ req.file.filename }`;
      await execPromise(command);

      log.info(`Temporary folder ${ req.file.destination }stream${ req.file.filename } with stream chunks was removed.`);

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
        thumbnail: req.file.filename,
        currentOwner: author,
        contract: foundContract._id,
        product,
        offer
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

      await context.store.addMedia(ipfsCid, {
        key: exportedKey,
        uri: _.get(gateway, process.env.IPFS_SERVICE, defaultGateway),
        ...meta,
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
