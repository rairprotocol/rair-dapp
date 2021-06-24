const express = require('express');
const { retrieveMediaInfo, addPin, removePin, addFolder } = require('../integrations/ipfs');
const upload = require('../Multer/Config.js');
const { exec } = require('child_process');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const fetch = require('node-fetch');
const StartHLS = require('../hls-starter.js');
const _ = require('lodash');
const { JWTVerification, validation } = require('../middleware');

const rareify = async (fsRoot) => {
  // Generate a key
  const key = crypto.generateKeySync('aes', { length: 128 });

  fs.writeFileSync(fsRoot + '/.key', key.export());

  const promiseList = [];

  console.log('Rareifying ', fsRoot);

  // Encrypting .ts files
  for await (const entry of readdirp(fsRoot)) {
    const { fullPath, basename } = entry;
    if (path.extname(basename) === '.ts') {
      const promise = new Promise((resolve, reject) => {
        const encryptedPath = fullPath + '.encrypted';
        // console.log('encrypting', fullPath)
        try {
          const iv = intToByteArray(parseInt(basename.match(/([0-9]+).ts/)[1]));
          const encrypt = crypto.createCipheriv('aes-128-cbc', key, iv);
          const source = fs.createReadStream(fullPath);
          const dest = fs.createWriteStream(encryptedPath);
          source.pipe(encrypt).pipe(dest).on('finish', () => {
            // overwrite the unencrypted file so we don't have to modify the manifests
            fs.renameSync(encryptedPath, fullPath);
            resolve(true);
            console.log('finished encrypting', entry.path);
          });
        } catch (e) {
          console.log('Could not encrypt', fullPath, e);
          reject(e);
        }
      });
      promiseList.push(promise);
    }
  }
  console.log('Done scheduling encryptions,', promiseList.length, 'promises for', readdirp(fsRoot).length, 'files');
  return await Promise.all(promiseList)
    .then(_ => {
      console.log('RAIR-ification successful! The root directory is ready to be uploaded to IPFS.');
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
      await addPin(mediaId);
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
  router.delete('/remove/:mediaId', validation('removeMedia', 'params'), async (req, res) => {
    const mediaId = req.params.mediaId;
    await context.store.removeMedia(mediaId);
    await context.db.File.deleteOne({ _id: mediaId });
    try {
      await removePin(mediaId);
    } catch (e) {
      console.warn(`Could not remove pin ${ mediaId }, ${ e }`);
    }
    res.sendStatus(200);
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
  router.get('/list', async (req, res, next) => {
    try {
      const { pageNum = '1', filesPerPage = '10', sortBy = 'creationDate', sort = '-1', searchString } = req.query;

      const searchQuery = searchString ? { $text: { $search: searchString } } : {};
      const pageSize = parseInt(filesPerPage, 10);
      const sortDirection = parseInt(sort, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;
      const data = await context.db.File.find(searchQuery)
        .skip(skip)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]]);

      const list = _.reduce(data, (result, value) => {
        result[value._id] = value;
        return result;
      }, {});

      res.json({ success: true, list });
    } catch (e) {
      console.log(e);
      next(e.message);
    }
  });

  router.post('/upload', upload.single('video'), JWTVerification(context), validation('uploadVideoFile', 'file'), validation('uploadVideo'), async (req, res) => {
    const { title, description, contractAddress } = req.body;
    const { adminNFT: author } = req.user;

    console.log('Processing: ', req.file.originalname);

    if (req.file) {
      let command = 'pwd && mkdir ' + req.file.destination + 'stream' + req.file.filename + '/';
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
        }
      });
      console.log(req.file.originalname, 'generating thumbnails');
      command = 'ffmpeg -ss 3 -i ' + req.file.path + ' -vf "select=gt(scene,0.5)" -vf "scale=144:-1" -vsync vfr -frames:v 1 ' + req.file.destination + 'Thumbnails/' + req.file.filename + '.png && ffmpeg -i ' + req.file.path + ' -vf  "scale=144:-1" -ss 00:10 -t 00:03 ' + req.file.destination + 'Thumbnails/' + req.file.filename + '.gif';
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(req.file.originalname, error);
        }
        res.json({ success: true, result: req.file.filename });
        command = 'ffmpeg -i ' + req.file.path + ' -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ' + req.file.destination + 'stream' + req.file.filename + '/stream.m3u8';
        console.log(req.file.originalname, 'converting to stream');
        exec(command, { maxBuffer: 1024 * 1024 * 20 }, async (error, stdout, stderr) => {
          if (error) {
            console.log(req.file.originalname, error);
          }
          const exportedKey = await rareify(req.file.destination + 'stream' + req.file.filename);
          console.log('DONE');
          const rairJson = {
            title,
            mainManifest: 'stream.m3u8',
            author,
            encryptionType: 'aes-128-cbc'
          };

          if (description) {
            rairJson.description = description;
          }

          fs.writeFileSync(req.file.destination + 'stream' + req.file.filename + '/rair.json', JSON.stringify(rairJson, null, 4));

          command = 'rm -f ' + req.file.path;
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.log(req.file.originalname, error);
            }
            console.log(req.file.originalname, 'raw deleted');
          });
          console.log(req.file.originalname, 'pinning to ipfs');

          const c = await addFolder(`${ req.file.destination }stream${ req.file.filename }/`, `stream${ req.file.filename }`/*, { pin: true, quieter: true }*/);

          const meta = {
            mainManifest: 'stream.m3u8',
            author,
            encryptionType: 'aes-128-cbc',
            title,
            thumbnail: req.file.filename,
            currentOwner: author,
            contractAddress
          };

          if (description) {
            meta.description = description;
          }

          const ipfsCid = _.chain(c.cid)
            .split('(')
            .last()
            .split(')')
            .first()
            .value();
          console.log(req.file.originalname, 'ipfs done: ', ipfsCid);
          await context.store.addMedia(ipfsCid, {
            key: exportedKey, ...meta,
            uri: process.env.IPFS_GATEWAY + '/' + ipfsCid,
          });

          await context.db.File.create({
            _id: ipfsCid,
            key: exportedKey.toJSON(), ...meta,
            uri: process.env.IPFS_GATEWAY + '/' + ipfsCid,
          });

          context.hls = StartHLS();
          fetch('https://api.pinata.cloud/pinning/pinByHash', {
            method: 'POST',
            body: JSON.stringify({ hashToPin: ipfsCid }),
            headers: {
              pinata_api_key: process.env.PINATA_KEY,
              pinata_secret_api_key: process.env.PINATA_SECRET,
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          })
            .then(blob => blob.json())
            .then(response => {
              console.log('PINATA RESPONSE', response);
            })
            .catch(err => {
              console.log('PINATA ERROR', err);
            });
        });
      });
    }
  });

  return router;
};
