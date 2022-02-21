const express = require('express');
const _ = require('lodash');
const fs = require('fs').promises;
const { JWTVerification, validation } = require('../../../../../middleware');
const { addMetadata, addPin, removePin, addFile } = require('../../../../../integrations/ipfsService')();
const upload = require('../../../../../Multer/Config.js');
const log = require('../../../../../utils/logger')(module);

module.exports = context => {
  const router = express.Router();

  // Get specific token by internal token ID
  router.get('/', async (req, res, next) => {
    try {
      const { contract, offerPool, token } = req;

      const result = await context.db.MintedToken.findOne({
        contract: contract._id,
        offerPool: offerPool.marketplaceCatalogIndex,
        token
      });

      return res.json({ success: true, result });
    } catch (err) {
      return next(err);
    }
  });

  // Update specific token metadata by internal token ID
  router.post('/', JWTVerification(context), upload.array('files', 2), validation('updateTokenMetadata'), async (req, res, next) => {
    try {
      const { contract, offerPool, token } = req;
      const { user } = req;
      let fieldsForUpdate = _.pick(req.body, ['name', 'description', 'artist', 'external_url', 'image', 'animation_url', 'attributes']);

      if (user.publicAddress !== contract.user) {
        if (req.files.length) {
          await Promise.all(_.map(req.files, async file => {
            await fs.rm(`${ file.destination }/${ file.filename }`);
            log.info(`File ${ file.filename } has removed.`);
          }));
        }

        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating token ${ token }.`
        });
      }

      if (_.isEmpty(fieldsForUpdate)) {
        if (req.files.length) {
          await Promise.all(_.map(req.files, async file => {
            await fs.rm(`${ file.destination }/${ file.filename }`);
            log.info(`File ${ file.filename } has removed.`);
          }));
        }

        return res.status(400).send({ success: false, message: 'Nothing to update.' });
      }

      if (req.files.length) {
        const files = await Promise.all(_.map(req.files, async file => {
          try {
            const cid = await addFile(file.destination, file.filename);
            await addPin(cid, file.filename);

            log.info(`File ${ file.filename } has added to ipfs.`);

            file.link = `${ context.config.pinata.gateway }/${ cid }/${ file.filename }`;
            return file;
          } catch (err) {
            log.error(err);
          }
        }));

        _.chain(fieldsForUpdate)
          .pick(['image', 'animation_url'])
          .forEach((value, key) => {
            const v = _.chain(files)
              .find(f => f.originalname === value)
              .get('link')
              .value();

            if (v) fieldsForUpdate[key] = v;
            else delete fieldsForUpdate[key];
          })
          .value();
      }

      // sanitize fields
      let sanitizedFieldsForUpdate = {};
      _.forEach(fieldsForUpdate, (v, k) => {
        sanitizedFieldsForUpdate[k] = _.includes(['image', 'animation_url', 'external_url', 'attributes'], k) ? v : context.textPurify.sanitize(v);
      })

      sanitizedFieldsForUpdate = _.mapKeys(sanitizedFieldsForUpdate, (v, k) => `metadata.${ k }`);

      const updatedToken = await context.db.MintedToken.findOneAndUpdate({
        contract: contract._id,
        offerPool: offerPool.marketplaceCatalogIndex,
        token
      }, sanitizedFieldsForUpdate, { new: true });

      if (req.files.length) {
        await Promise.all(_.map(req.files, async file => {
          await fs.rm(`${ file.destination }/${ file.filename }`);
          log.info(`File ${ file.filename } has removed.`);
        }));
      }

      return res.json({ success: true, token: updatedToken });
    } catch (err) {
      if (req.files.length) {
        await Promise.all(_.map(req.files, async file => {
          await fs.rm(`${ file.destination }/${ file.filename }`);
          log.info(`File ${ file.filename } has removed.`);
        }));
      }

      return next(err);
    }
  });

  // Pin metadata to pinata cloud
  router.get('/pinning', JWTVerification(context), async (req, res, next) => {
    try {
      const { contract, offerPool, token } = req;
      const { user } = req;
      const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
      let metadataURI = 'none';

      if (user.publicAddress !== contract.user) {
        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating token ${ token }.`
        });
      }

      const foundToken = await context.db.MintedToken.findOne({
        contract: contract._id,
        offerPool: offerPool.marketplaceCatalogIndex,
        token
      });

      if (_.isEmpty(foundToken)) {
        return res.status(400).send({ success: false, message: 'Token not found.' });
      }

      if (!foundToken.isMinted) {
        return res.status(400).send({ success: false, message: 'Token not minted.' });
      }

      metadataURI = foundToken.metadataURI;

      if (!_.isEmpty(foundToken.metadata)) {
        const CID = await addMetadata(foundToken.metadata, _.get(foundToken.metadata, 'name', 'none'));
        await addPin(CID, `metadata_${ _.get(foundToken.metadata, 'name', 'none') }`);
        metadataURI = `${ process.env.PINATA_GATEWAY }/${ CID }`;
      }

      if (reg.test(foundToken.metadataURI)) {
        const CID = _.chain(foundToken.metadataURI)
          .split('/')
          .last()
          .value();
        await removePin(CID);
      }

      await foundToken.updateOne({ metadataURI });

      return res.json({ success: true, metadataURI });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
