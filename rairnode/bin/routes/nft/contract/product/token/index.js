const express = require('express');
const _ = require('lodash');
const fs = require('fs').promises;
const {
  JWTVerification,
  validation,
  dataTransform,
} = require('../../../../../middleware');
const { addMetadata, addPin, removePin, addFile } =
  require('../../../../../integrations/ipfsService')();
const upload = require('../../../../../Multer/Config');
const log = require('../../../../../utils/logger')(module);

module.exports = (context) => {
  const router = express.Router();

  // Get specific token by internal token ID
  router.get('/', async (req, res, next) => {
    try {
      const { contract, offers, offerPool, token } = req;
      const options = _.assign(
        {
          contract: contract._id,
          token,
        },
        contract.diamond
          ? { offer: { $in: offers } }
          : { offerPool: offerPool.marketplaceCatalogIndex },
      );

      const result = await context.db.MintedToken.findOne(options);

      if (result === null) {
        return res
          .status(404)
          .send({ success: false, message: 'Token not found.' });
      }

      return res.json({ success: true, result });
    } catch (err) {
      return next(err);
    }
  });

  // Update specific token metadata by internal token ID
  router.post(
    '/',
    JWTVerification,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('updateTokenMetadata'),
    async (req, res, next) => {
      try {
        const { contract, offers, offerPool, token } = req;
        const { user } = req;
        const fieldsForUpdate = _.pick(req.body, [
          'name',
          'description',
          'artist',
          'external_url',
          'image',
          'animation_url',
          'attributes',
        ]);
        const options = _.assign(
          {
            contract: contract._id,
            token,
          },
          contract.diamond
            ? { offer: { $in: offers } }
            : { offerPool: offerPool.marketplaceCatalogIndex },
        );

        if (user.publicAddress !== contract.user) {
          if (req.files.length) {
            await Promise.all(
              _.map(req.files, async (file) => {
                await fs.rm(`${file.destination}/${file.filename}`);
                log.info(`File ${file.filename} has removed.`);
              }),
            );
          }

          return res.status(403).send({
            success: false,
            message: `You have no permissions for updating token ${token}.`,
          });
        }

        if (_.isEmpty(fieldsForUpdate)) {
          if (req.files.length) {
            await Promise.all(
              _.map(req.files, async (file) => {
                await fs.rm(`${file.destination}/${file.filename}`);
                log.info(`File ${file.filename} has removed.`);
              }),
            );
          }

          return res
            .status(400)
            .send({ success: false, message: 'Nothing to update.' });
        }

        const countDocuments = await context.db.MintedToken.countDocuments(
          options,
        );

        if (countDocuments === 0) {
          if (req.files.length) {
            await Promise.all(
              _.map(req.files, async (file) => {
                await fs.rm(`${file.destination}/${file.filename}`);
                log.info(`File ${file.filename} has removed.`);
              }),
            );
          }

          return res
            .status(400)
            .send({ success: false, message: 'Token not found.' });
        }

        if (req.files.length) {
          const files = await Promise.all(
            _.map(req.files, async (file) => {
              try {
                const cid = await addFile(file.destination, file.filename);
                await addPin(cid, file.filename);

                log.info(`File ${file.filename} has added to ipfs.`);

                file.link = `${context.config.pinata.gateway}/${cid}/${file.filename}`;

                return file;
              } catch (err) {
                log.error(err);

                return err;
              }
            }),
          );

          _.chain(fieldsForUpdate)
            .pick(['image', 'animation_url'])
            .forEach((value, key) => {
              const v = _.chain(files)
                .find((f) => f.originalname === value)
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
          sanitizedFieldsForUpdate[k] = _.includes(
            ['image', 'animation_url', 'external_url', 'attributes'],
            k,
          )
            ? v
            : context.textPurify.sanitize(v);
        });

        sanitizedFieldsForUpdate = _.mapKeys(
          sanitizedFieldsForUpdate,
          (v, k) => `metadata.${k}`,
        );

        const updatedToken = await context.db.MintedToken.findOneAndUpdate(
          options,
          {
            ...sanitizedFieldsForUpdate,
            isMetadataPinned: false,
          },
          { new: true },
        );

        if (req.files.length) {
          await Promise.all(
            _.map(req.files, async (file) => {
              await fs.rm(`${file.destination}/${file.filename}`);
              log.info(`File ${file.filename} has removed.`);
            }),
          );
        }

        return res.json({ success: true, token: updatedToken });
      } catch (err) {
        if (req.files.length) {
          await Promise.all(
            _.map(req.files, async (file) => {
              await fs.rm(`${file.destination}/${file.filename}`);
              log.info(`File ${file.filename} has removed.`);
            }),
          );
        }

        return next(err);
      }
    },
  );

  // Pin metadata to pinata cloud
  router.get('/pinning', JWTVerification, async (req, res, next) => {
    try {
      const { contract, offers, offerPool, token } = req;
      const { user } = req;
      // eslint-disable-next-line prefer-regex-literals
      const reg = new RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
      );
      let metadataURI = 'none';

      if (user.publicAddress !== contract.user) {
        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating token ${token}.`,
        });
      }

      const options = _.assign(
        {
          contract: contract._id,
          token,
        },
        contract.diamond
          ? { offer: { $in: offers } }
          : { offerPool: offerPool.marketplaceCatalogIndex },
      );

      const foundToken = await context.db.MintedToken.findOne(options);

      if (_.isEmpty(foundToken)) {
        return res
          .status(400)
          .send({ success: false, message: 'Token not found.' });
      }

      metadataURI = foundToken.metadataURI;

      if (!_.isEmpty(foundToken.metadata)) {
        const CID = await addMetadata(foundToken.metadata, _.get(foundToken.metadata, 'name', 'none'));
        await addPin(CID, `metadata_${_.get(foundToken.metadata, 'name', 'none')}`);
        metadataURI = `${process.env.PINATA_GATEWAY}/${CID}`;
      }

      if (reg.test(foundToken.metadataURI)) {
        const CID = _.chain(foundToken.metadataURI).split('/').last().value();
        await removePin(CID);
      }

      await foundToken.updateOne({ metadataURI, isMetadataPinned: true });

      return res.json({ success: true, metadataURI });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
