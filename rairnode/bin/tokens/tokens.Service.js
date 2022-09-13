const { promises: fs } = require('fs');
const _ = require('lodash');
const {
  OfferPool,
  Offer,
  MintedToken,
  Contract,
  Product,
} = require('../models');
const config = require('../config');
const { addPin, addFile } = require('../integrations/ipfsService')();
const log = require('../utils/logger')(module);
const { textPurify, cleanStorage } = require('../utils/helpers');
const eFactory = require('../utils/entityFactory');

const { pinata } = config;

const getOffersAndOfferPools = async (contract, product) => {
  let offerPool = [];

  const offers = await Offer.find({
    contract: contract._id,
    product,
  });

  if (_.isEmpty(offers)) {
    throw new Error('Offers not found.');
  }

  if (!contract.diamond) {
    offerPool = await OfferPool.findOne({
      contract: contract._id,
      product,
    });

    if (_.isEmpty(offerPool)) {
      throw new Error('Offerpool not found.');
    }
  }

  return [offers, offerPool];
};

const prepareTokens = (
  tokens,
  metadata,
  contract,
  offers,
  product,
  offerPool,
) => {
  const firstTokenInProduct = BigInt(product.firstTokenIndex);
  const mainFields = { contract: contract._id };

  if (!contract.diamond) {
    mainFields.offerPool = offerPool.marketplaceCatalogIndex;
  }

  _.forEach(offers, (offer) => {
    const start = BigInt(offer.range[0]);
    const end = BigInt(offer.range[1]);

    // eslint-disable-next-line no-plusplus
    for (let index = start; index <= end; index++) {
      tokens.push({
        ...mainFields,
        token: index.toString(),
        ownerAddress: `0xooooooooooooooooooooooooooooooooooo${index}`,
        offer: contract.diamond ? offer.diamondRangeIndex : offer.offerIndex,
        uniqueIndexInContract: (firstTokenInProduct + index).toString(),
        isMinted: false,
        isURIStoredToBlockchain: false,
        metadata,
      });
    }
  });
};

exports.createTokensWithCommonMetadata = async (req, res, next) => {
  try {
    const { user } = req;
    const newTokens = [];
    const sanitizedMetadataFields = {};
    let metadataFields = _.pick(req.body, [
      'name',
      'description',
      'artist',
      'external_url',
      'image',
      'animation_url',
      'attributes',
    ]);

    const { contract, commonMetadataFor, product } = _.pick(req.body, [
      'contract',
      'commonMetadataFor',
      'product',
    ]);

    if (_.isEmpty(metadataFields)) {
      await cleanStorage(req.files);
      return res
        .status(400)
        .send({ success: false, message: 'Nothing to store.' });
    }

    const foundContract = await Contract.findById(contract);

    if (_.isEmpty(foundContract)) {
      await cleanStorage(req.files);
      return res
        .status(404)
        .send({ success: false, message: 'Contract not found.' });
    }

    if (user.publicAddress !== foundContract.user) {
      await cleanStorage(req.files);
      return res
        .status(403)
        .send({ success: false, message: 'This contract not belong to you.' });
    }

    // upload files to IPFS cloud storage
    const uploadFilesToIpfs = async () => {
      if (req.files.length) {
        const files = await Promise.all(
          _.map(req.files, async (file) => {
            try {
              const cid = await addFile(file.destination, file.filename);
              await addPin(cid, file.filename);

              log.info(`File ${file.filename} has added to ipfs.`);

              // eslint-disable-next-line no-param-reassign
              file.link = `${pinata.gateway}/${cid}/${file.filename}`;

              return file;
            } catch (err) {
              log.error(err);

              return err;
            }
          }),
        );

        try {
          _.chain(metadataFields)
            .pick(['image', 'animation_url'])
            .forEach((value, key) => {
              const v = _.chain(files)
                .find((f) => f.originalname === value)
                .get('link')
                .value();

              if (v) metadataFields[key] = v;
              else delete metadataFields[key];
            })
            .value();
        } catch (err) {
          log.error(err);
        }
      } else {
        metadataFields = _.omit(metadataFields, ['image', 'animation_url']);
      }

      // sanitize fields
      _.forEach(metadataFields, (v, k) => {
        sanitizedMetadataFields[k] = _.includes(
          ['image', 'animation_url', 'external_url', 'attributes'],
          k,
        )
          ? v
          : textPurify.sanitize(v);
      });
    };

    if (commonMetadataFor === 'contract') {
      // check if does specific Contract already contains created tokens
      if (foundContract.singleMetadata) {
        const tokensCount = await MintedToken.count({
          contract: foundContract._id,
        });

        if (tokensCount > 0) {
          await cleanStorage(req.files);
          return res
            .status(400)
            .send({
              success: false,
              message: `Current Contract already have ${tokensCount} created tokens.`,
            });
        }
      }

      await uploadFilesToIpfs();

      // set singleMetadata to true for found contract
      await foundContract.updateOne({ singleMetadata: true });

      const foundProducts = await Product.find({ contract: foundContract._id });

      if (!foundProducts) {
        await cleanStorage(req.files);
        return res.status(404).send({
          success: false,
          message: `Products for contract ${foundContract._id} not found.`,
        });
      }

      await Promise.all(
        _.map(foundProducts, async (foundProduct) => {
          try {
            const [offers, offerPool] = await getOffersAndOfferPools(
              foundContract,
              foundProduct.collectionIndexInContract,
            );

            return prepareTokens(
              newTokens,
              sanitizedMetadataFields,
              foundContract,
              offers,
              foundProduct,
              offerPool,
            );
          } catch (err) {
            await cleanStorage(req.files);
            return res
              .status(404)
              .send({ success: false, message: err.message });
          }
        }),
      );
    } else {
      try {
        const foundProduct = await Product.findOne({
          contract: foundContract._id,
          collectionIndexInContract: product,
        });

        if (!foundProduct) {
          await cleanStorage(req.files);
          return res.status(404).send({
            success: false,
            message: `Product for contract ${foundContract._id} not found.`,
          });
        }

        const [offers, offerPool] = await getOffersAndOfferPools(
          foundContract,
          product,
        );

        // check if does specific Product already contains created tokens
        if (foundProduct.singleMetadata) {
          const options = _.assign(
            {
              contract: foundContract._id,
            },
            contract.diamond
              ? { offer: { $in: _.map(offers, (i) => i.diamondRangeIndex) } }
              : { offerPool: offerPool.marketplaceCatalogIndex },
          );
          const tokensCount = await MintedToken.count(options);

          if (tokensCount > 0) {
            await cleanStorage(req.files);
            return res
              .status(400)
              .send({
                success: false,
                message: `Current Product already have ${tokensCount} created tokens.`,
              });
          }
        }

        await uploadFilesToIpfs();

        // set singleMetadata to true for found product
        await foundProduct.updateOne({ singleMetadata: true });

        prepareTokens(
          newTokens,
          sanitizedMetadataFields,
          foundContract,
          offers,
          foundProduct,
          offerPool,
        );
      } catch (err) {
        await cleanStorage(req.files);
        return res.status(404).send({ success: false, message: err.message });
      }
    }

    if (!_.isEmpty(newTokens)) {
      try {
        await MintedToken.insertMany(newTokens, { ordered: false });
        log.info('All tokens is stored.');
      } catch (err) {
        log.error(err);
      }
    } else {
      await cleanStorage(req.files);
      return res.json({
        success: false,
        message: "Don't have tokens for creation.",
      });
    }

    await cleanStorage(req.files);

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

exports.getSingleToken = eFactory.getOne(MintedToken, { filter: { contract: 'contract._id', token: 'params.token', specificFilterOptions: 'specificFilterOptions' } });

exports.updateSingleTokenMetadata = async (req, res, next) => {
  try {
    const { contract, offers, offerPool } = req;
    const { token } = req.params;
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

    const countDocuments = await MintedToken.countDocuments(
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
      const files = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of req.files) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const cid = await addFile(file.destination, file.filename);
          // eslint-disable-next-line no-await-in-loop
          await addPin(cid, file.filename);

          log.info(`File ${file.filename} has added to ipfs.`);

          file.link = `${pinata.gateway}/${cid}/${file.filename}`;

          files.push(file);
        } catch (err) {
          log.error(err);

          return err;
        }
      }

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
        : textPurify.sanitize(v);
    });

    sanitizedFieldsForUpdate = _.mapKeys(
      sanitizedFieldsForUpdate,
      (v, k) => `metadata.${k}`,
    );

    const updatedToken = await MintedToken.findOneAndUpdate(
      options,
      {
        ...sanitizedFieldsForUpdate,
        isMetadataPinned: false,
        isURIStoredToBlockchain: false,
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
};
