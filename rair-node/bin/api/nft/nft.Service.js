const fs = require('graceful-fs');
const { nanoid } = require('nanoid');
const path = require('path');
const _ = require('lodash');

const fsPromises = fs.promises;
const { ZeroAddress } = require('ethers');
const { addPin, addFolder, addMetadata, removePin, addFile } = require('../../integrations/ipfsService')();
const config = require('../../config');
const log = require('../../utils/logger')(module);
const {
  Product,
  OfferPool,
  Offer,
  MintedToken,
  Contract,
  TokenMetadata,
  ServerSetting,
  File,
  Unlock,
} = require('../../models');
const { processMetadata } = require('../../utils/metadataClassify');
const { textPurify, attributesCounter, checkFileAccess } = require('../../utils/helpers');
const AppError = require('../../utils/errors/AppError');

const ipfsGateway = config.ipfsGateways[process.env.IPFS_SERVICE];

module.exports = {
    getUserTokensProfile: async (req, res, next) => {
        try {
            const { userAddress } = req.params;

            const { itemsPerPage = 10, pageNum = 1, onResale = 'false' } = req.query;
            const pageSize = parseInt(itemsPerPage, 10);
            const skip = (parseInt(pageNum, 10) - 1) * pageSize;

            const pipeline = [{
                $lookup: {
                    from: 'Contract',
                    localField: 'contract',
                    foreignField: '_id',
                    as: 'contract',
                },
            },
            {
                $unwind: {
                    path: '$contract',
                },
            },
            {
                $match: {
                    ownerAddress: userAddress,
                    'contract.blockView': false,
                },
            }];

            if (onResale.toString() === 'true') {
                pipeline.push({
                    $lookup: {
                      from: 'ResaleTokenOffer',
                      localField: 'uniqueIndexInContract',
                      foreignField: 'tokenIndex',
                      as: 'resaleData',
                      let: {
                          tokenContract: '$tokenContract',
                      },
                      pipeline: [{
                          $match: {
                          $expr: {
                              $eq: ['$$tokenContract', '$contract'],
                          },
                          buyer: { $exists: false },
                          },
                      }],
                    },
                }, {
                    $addFields: {
                    resaleData: { $arrayElemAt: ['$resaleData', 0] },
                    },
                }, {
                    $match: {
                    resaleData: { $exists: true },
                    },
                });
            }

            const result = await MintedToken.aggregate([
                ...pipeline,
                { $skip: skip },
                { $limit: pageSize },
            ]);

            const count = await MintedToken.aggregate([
                ...pipeline,
                {
                    $count: 'totalCount',
                },
            ]);

            res.json({ success: true, result, totalCount: count[0]?.totalCount });
        } catch (e) {
            next(e);
        }
    },
    metadataCSVSample: async (req, res, next) => {
        try {
            const file = path.join(__dirname, '../../../assets/sample.csv');
            return res.download(file);
        } catch (e) {
            return next(e);
        }
    },
    pinMetadataToIPFS: async (req, res, next) => {
        const { contractId, product, overwritePin = 'false' } = req.body;
        const { user } = req;
        const folderName = `${Date.now()}-${nanoid()}`;
        const pathTo = `${process.cwd()}/tmp`;
        let foundProduct = {};
        let commonMetadataToken = null;
        let singleMetadataFor = '';
        let metadataURI = '';
        let CID = '';

        try {
        const contract = await Contract.findById(contractId);

        if (!contract) {
            return next(new AppError('Contract not found.', 404));
        }

        if (user.publicAddress !== contract.user) {
            return next(new AppError('You have no permissions for uploading metadata.', 403));
        }

        let options = {
            contract: contract._id,
            'metadata.name': { $nin: ['', 'none'] },
        };

        // If we are not overwriting, find all tokens that aren't pinned already
        if (overwritePin !== 'true') {
            options.isMetadataPinned = false;
        }

        if (product) {
            foundProduct = await Product.findOne({
            contract: contract._id,
            collectionIndexInContract: product,
            });

            if (!foundProduct) {
              return next(new AppError('Product not found.', 404));
            }
        }

        if (contract.singleMetadata) {
          singleMetadataFor = 'contract';
        }
        if (!!foundProduct && foundProduct.singleMetadata) {
          singleMetadataFor = 'product';
        }

        if (singleMetadataFor !== 'contract') {
          if (contract.diamond) {
            const offers = await Offer.find({
                contract: contract._id,
                product,
            }).distinct('diamondRangeIndex');

            if (_.isEmpty(offers)) {
                return next(new AppError('Offers not found.', 404));
            }

            options.offer = { $in: offers };
            } else {
            const offerPool = await OfferPool.findOne({
                contract: contract._id,
                product,
            });

            if (!offerPool) {
                return next(new AppError('OfferPool not found.', 404));
            }

            options = _.assign(options, {
                offerPool: offerPool.marketplaceCatalogIndex,
            });
          }
        }

        let foundTokens = await MintedToken.find(options);

        if (!foundTokens?.length) {
            return next(new AppError(`No tokens found ${overwritePin === true ? '' : ' with unpinned metadata'}`, 400));
        }

        // create a folder with all metadata files for uploading
        if (!singleMetadataFor) {
            // create directory
            try {
            await fsPromises.access(`${pathTo}/${folderName}`);
            } catch (e) {
            log.info(`Create directory ${pathTo}/${folderName}`);
            await fsPromises.mkdir(`${pathTo}/${folderName}`);
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const token of foundTokens) {
            // console.info(`Writing file for token #${token.uniqueIndexInContract}`);
            try {
                // If the IPFS gateway exists, replace with an universal prefix
                // This will NOT affect the database, only the JSON files being generated
                token.metadata.image = token.metadata.image.replace(
                'https://ipfs.io/ipfs/',
                'ipfs://',
                );
                fs.writeFileSync(
                `${pathTo}/${folderName}/${token.uniqueIndexInContract}.json`,
                JSON.stringify(token.metadata, null, 2),
                );
            } catch (error) {
                return next(new AppError(`Error writing file for NFT ${token.uniqueIndexInContract}`));
            }
            }

            // upload folder to cloud
            CID = await addFolder(`${pathTo}/${folderName}`, folderName);
            await addPin(CID, `metadata_folder_${folderName}`);
        } else {
            // get source token for the common metadata
            if (singleMetadataFor === 'contract') {
              commonMetadataToken = await MintedToken.findOne({ contract: contract._id, uniqueIndexInContract: '0' });
            } else {
              commonMetadataToken = await MintedToken.findOne({
                  contract: contract._id,
                  uniqueIndexInContract: foundProduct.firstTokenIndex,
              });
            }

            commonMetadataToken = commonMetadataToken || _.first(foundTokens);

            // store common metadata to cloud
            CID = await addMetadata(commonMetadataToken.metadata, _.get(commonMetadataToken.metadata, 'name', 'none'));
            await addPin(CID, `metadata_${_.get(commonMetadataToken.metadata, 'name', 'none')}`);
        }

        // prepare all data for updating of tokens, contract or product
        const storageLink = _.get(
            {
              ipfs: `${config.ipfs.gateway}/${CID}`,
              pinata: `${config.pinata.gateway}/${CID}`,
            },
            config.ipfsService,
            `${config.pinata.gateway}/${CID}`,
        );

        if (singleMetadataFor) metadataURI = storageLink;

        foundTokens = foundTokens.map((item) => ({
            updateOne: {
            filter: { contract: contract._id, uniqueIndexInContract: item.uniqueIndexInContract },
            update: { metadataURI: !singleMetadataFor ? `${storageLink}/${item.uniqueIndexInContract}.json` : 'none', isMetadataPinned: true, isURIStoredToBlockchain: false },
            },
        }));

        // updating data in DB
        switch (singleMetadataFor) {
            case 'contract':
            await Contract.findByIdAndUpdate(contract._id, { $set: { metadataURI } });
            break;
            case 'product':
            await Product.findByIdAndUpdate(foundProduct._id, { $set: { metadataURI } });
            break;
            default:
            break;
        }

        try {
            await MintedToken.bulkWrite(foundTokens, { ordered: false });
        } catch (err) { log.error(err); }

        // removed the temporary folder
        if (!singleMetadataFor) await fsPromises.rm(`${pathTo}/${folderName}`, { recursive: true });

        if (typeof CID !== 'string') {
            log.error(`Invalid CID detected: ${CID}`);
            CID = '';
        }

        return res.json(!singleMetadataFor ? {
            success: true,
            CID,
            totalCount: foundTokens.length,
        } : { success: true, metadataURI });
        } catch (err) {
        // removed the temporary folder
        try {
            await fsPromises.access(`${pathTo}/${folderName}`);
            await fsPromises.rm(`${pathTo}/${folderName}`, { recursive: true });
        } catch (e) {
            // console.error('There was an error removing files');
        }

        return next(err);
        }
    },
    findContractAndProductMiddleware: async (req, res, next) => {
        try {
            const { contract, networkId, product } = req.params;
            const data = await Contract.aggregate([
              {
                $match: {
                  blockchain: networkId,
                  contractAddress: contract.toLowerCase(),
                },
              },
              {
                $lookup: {
                  from: 'Product',
                  as: 'productData',
                  let: { contractId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$contractId', '$contract'],
                        },
                        collectionIndexInContract: product,
                      },
                    },
                  ],
                },
              },
            ]);

            if (!contract) {
                return next(new AppError('Data not found.', 404));
            }

            const { productData, ...contractData } = data[0];

            req.contract = contractData;
            [req.product] = productData;

            return next();
        } catch (e) {
            return next(e);
        }
    },
    findTokenInContract: async (req, res, next) => {
        try {
        const { contract } = req;
        const { tokenInContract } = req.params;
        const uniqueIndexInContract = tokenInContract;

        const result = await MintedToken.findOne({
            contract: contract._id,
            uniqueIndexInContract,
        });

        res.json({ success: true, result });
        } catch (err) {
        next(err);
        }
    },
    getTokenNumbers: async (req, res, next) => {
      try {
        const { contract, product } = req;
        const { fromToken, toToken } = req.query;
        const tokenLimitFilter = [];
        if (fromToken) {
          tokenLimitFilter.push(
            {
              $gte: ['$token', fromToken],
            },
          );
        }
        if (toToken) {
          tokenLimitFilter.push(
            {
              $lte: ['$token', toToken],
            },
          );
        }
        const offerData = await Offer.aggregate([
          {
            $match: {
              $expr: {
                $eq: [contract._id, '$contract'],
              },
              product: product.collectionIndexInContract,
            },
          },
          {
            $lookup: {
              from: 'MintedToken',
              let: { offerIndex: '$diamondRangeIndex' },
              as: 'tokens',
              pipeline: [{
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$offer', '$$offerIndex'],
                      },
                      ...tokenLimitFilter,
                    ],
                  },
                  contract: contract._id,
                },
              },
              {
                $sort: { uniqueIndexInContract: 1 },
              },
              {
                $addFields: {
                  sold: {
                    $cond: {
                      if: { $eq: ['$ownerAddress', ZeroAddress] },
                      then: false,
                      else: true,
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  token: 1,
                  sold: 1,
                },
              },
            ],
            },
          },
          {
            $project: {
              tokens: 1,
            },
          },
        ]).collation({ locale: 'en_US', numericOrdering: true });
        return res.json({
          success: true,
          tokens: offerData.reduce((total, offer) => total.concat(offer.tokens), []),
        });
      } catch (err) {
        return next(err);
      }
    },
    getProductAttributes: async (req, res, next) => {
        try {
            const { contract, product } = req;
            let attributes = await TokenMetadata.findOne({
                contract: contract._id,
                product: product.collectionIndexInContract,
            });
            if (attributes === null || attributes?.attributes?.length === 0) {
                await processMetadata(contract._id, product.collectionIndexInContract);
                attributes = await TokenMetadata.findOne({
                    contract: contract._id,
                    product: product.collectionIndexInContract,
                });
            }
            return res.json({
                success: true,
                attributes,
            });
        } catch (err) {
            return next(err);
        }
    },
    getTokensForProduct: async (req, res, next) => {
        try {
            const { contract, product } = req;
            const {
                fromToken = 0,
                toToken = 20,
                sortByToken = '1',
                sortByPrice = '',
                priceFrom = '',
                priceTo = '',
                forSale = '',
                onResale = false,
            } = req.query;
            let { metadataFilters } = req.query;
            const firstToken = (
              BigInt(fromToken) + BigInt(product.firstTokenIndex)
            );
            const tokenLimit = BigInt(toToken) - BigInt(fromToken) + 1n || 1n;

            let options = {
                $expr: { $gte: [{ $toDouble: '$uniqueIndexInContract' }, firstToken] },
            };
            const filterOptions = {};
            const populateOptions = {
                let: { contr: '$contract' },
                and: [
                    {
                        $eq: [
                            '$contract',
                            '$$contr',
                        ],
                    },
                ],
            };

            // set filters
            if (priceFrom || priceTo) {
                filterOptions['offer.price'] = _.assign({}, priceFrom ? { $gte: priceFrom } : {}, priceTo ? { $lte: priceTo } : {});
            }

            if (forSale !== '') {
                filterOptions.isMinted = forSale !== 'true';
            }

            const serverConfig = await ServerSetting.findOne({});
            if (serverConfig.onlyMintedTokensResult) {
                filterOptions.isMinted = true;
            }

            if (contract.diamond) {
                const offers = await Offer.find({
                    contract: contract._id,
                    product: product.collectionIndexInContract,
                }).distinct('diamondRangeIndex');

                if (_.isEmpty(offers)) {
                    return next(new AppError('Offers not found.', 404));
                }

                options = {
                    ...options,
                    contract: contract._id,
                    offer: { $in: offers },
                };
                populateOptions.let = _.assign(populateOptions.let, { diamondRangeI: '$offer' });
                populateOptions.and = _.concat(populateOptions.and, [
                    {
                        $eq: [
                        '$diamondRangeIndex',
                        '$$diamondRangeI',
                        ],
                    },
                ]);
            } else {
                const offerPool = await OfferPool.findOne({
                    contract: contract._id,
                    product: product.collectionIndexInContract,
                });

                if (_.isEmpty(offerPool)) {
                    return next(new AppError('OfferPools not found.', 404));
                }

                options = {
                    ...options,
                    contract: contract._id,
                    offerPool: offerPool.marketplaceCatalogIndex,
                };
                populateOptions.let = _.assign(populateOptions.let, { offeP: '$offerPool', offerIn: '$offer' });
                populateOptions.and = _.concat(populateOptions.and, [
                {
                    $eq: [
                        '$offerPool',
                        '$$offeP',
                    ],
                },
                {
                    $eq: [
                        '$offerIndex',
                        '$$offerIn',
                    ],
                },
                ]);
            }

            const aggregateOptions = [
                {
                    $match: {
                        ...options,
                    },
                },
                {
                  $lookup: {
                      from: 'Offer',
                      let: populateOptions.let,
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $and: populateOptions.and,
                                  },
                              },
                          },
                      ],
                      as: 'offer',
                  },
                },
                {
                  $lookup: {
                      from: 'User',
                      localField: 'ownerAddress',
                      foreignField: 'publicAddress',
                      as: 'ownerData',
                  },
                },
                {
                  $unwind: {
                    path: '$ownerData',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                { $unwind: '$offer' },
                { $match: filterOptions },
            ];

            if (onResale.toString() === 'true') {
                aggregateOptions.push({
                    $lookup: {
                        from: 'ResaleTokenOffer',
                        localField: 'uniqueIndexInContract',
                        foreignField: 'tokenIndex',
                        as: 'resaleData',
                        let: {
                            tokenContract: '$tokenContract',
                        },
                        pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ['$$tokenContract', '$contract'],
                            },
                            buyer: { $exists: false },
                        },
                        }],
                    },
                }, {
                    $addFields: {
                        resaleData: { $arrayElemAt: ['$resaleData', 0] },
                    },
                }, {
                    $match: {
                        resaleData: { $exists: true },
                    },
                });
            }

            if (metadataFilters) {
                try {
                    metadataFilters = JSON.parse(metadataFilters);
                    aggregateOptions.push({
                        $match: {
                        $or: Object.keys(metadataFilters).map((attr) => ({
                            'metadata.attributes': {
                                $elemMatch: {
                                trait_type: attr,
                                value: { $in: metadataFilters[attr] },
                                },
                            },
                            })),
                        },
                    });
                } catch (err) {
                  log.error(`Error parsing metadata filters ${err}`);
                }
            }

            const totalCount = _.chain(
                await MintedToken.aggregate(aggregateOptions)
                .count('tokens')
                .collation({ locale: 'en_US', numericOrdering: true }),
            )
                .head()
                .get('tokens', 0)
                .value();

            const tokensSorted = await MintedToken.aggregate(aggregateOptions)
                .sort(_.assign({}, sortByPrice ? { 'offer.price': Number(sortByPrice) } : {}, sortByToken ? { token: Number(sortByToken) } : {}))
                .collation({ locale: 'en_US', numericOrdering: true })
                .limit(tokenLimit);

            const tokens = attributesCounter(tokensSorted);

            return res.json({ success: true, result: { totalCount, tokens } });
        } catch (err) {
            return next(err);
        }
    },
    tokenNumberForProduct: async (req, res, next) => {
        try {
            const { contract, product } = req;
            let options = {};

            if (contract.diamond) {
                const offers = await Offer.find({
                    contract: contract._id,
                    product: product.collectionIndexInContract,
                }).distinct('diamondRangeIndex');

                if (_.isEmpty(offers)) {
                    return res
                        .status(404)
                        .send({ success: false, message: 'Offers not found.' });
                }

                options = {
                    contract: contract._id,
                    offer: { $in: offers },
                };
            } else {
                const offerPool = await OfferPool.findOne({
                    contract: contract._id,
                    product: product.collectionIndexInContract,
                });

                if (_.isEmpty(offerPool)) {
                    return res
                        .status(404)
                        .send({ success: false, message: 'OfferPools not found.' });
                }

                options = {
                    contract: contract._id,
                    offerPool: offerPool.marketplaceCatalogIndex,
                };
            }

            const tokens = await MintedToken.find(options)
                .sort([['token', 1]])
                .collation({ locale: 'en_US', numericOrdering: true })
                .distinct('token');

            return res.json({ success: true, tokens });
        } catch (err) {
            return next(err);
        }
    },
    filesForTokenInProduct: async (req, res, next) => {
        try {
          const { token } = req.params;
          const { contract, product } = req;

          let foundOffers = await Offer.find({
            contract: contract._id,
            product: product.collectionIndexInContract,
          });
          foundOffers = foundOffers.filter(
            (offer) => offer.range[0] < token && offer.range[1] > token,
          );
          const offerArray = foundOffers.map((item) => item._id);
          const foundUnlocks = await Unlock.find({
            offers: { $all: offerArray },
          }).populate('file');

          let files = foundUnlocks.map((unlock) => unlock.file);
          files = await checkFileAccess(files, req.user);

          return res.json({ success: true, files });
        } catch (err) {
          return next(err);
        }
      },
      getFilesForProduct: async (req, res, next) => {
        try {
          const { contract, product } = req;

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
            }, {
              $match: {
                $and: [{
                  'unlockData.offers.contract': contract._id,
                }, {
                  'unlockData.offers.product': product.collectionIndexInContract,
                }],
                hidden: { $ne: true },
              },
            }, {
              $project: {
                key: false,
                encryptionType: false,
                totalEncryptedFiles: false,
                extension: false,
                unlockData: false,
              },
            }, {
              $sort: {
                title: 1,
              },
            },
          ];

          const data = (await File.aggregate([
            ...pipeline,
          ]));

          // verify the user have needed tokens for unlock the files
          const files = await checkFileAccess(data, req.user);
          const loadedFiles = [];
          const filteredFiles = [];
          files.forEach((file) => {
            if (loadedFiles.includes(file._id)) {
              return;
            }
            filteredFiles.push(file);
            loadedFiles.push(file._id);
          });
          res.json({ success: true, files: filteredFiles });
        } catch (err) {
          next(err);
        }
      },
      getOffersForProduct: async (req, res, next) => {
        try {
          const { contract, product: productData } = req;

          const [product] = await Product.aggregate([
            { $match: {
              contract: contract._id,
              collectionIndexInContract: productData.collectionIndexInContract,
            } },
            {
              $lookup: {
                from: 'Offer',
                let: {
                  contr: '$contract',
                  prod: '$collectionIndexInContract',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$contract', '$$contr'],
                          },
                          {
                            $eq: ['$product', '$$prod'],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: 'offers',
              },
            },
          ]);

          if (!product) {
            res.json({ success: false, message: 'Product not found.' });
            return;
          }

          res.json({
            success: true,
            product: { ...product, owner: contract.user },
          });
        } catch (err) {
          next(err);
        }
      },
      getLockedOffersForProduct: async (req, res, next) => {
        try {
          const { contract, product } = req;

          const locks = await Offer.find({
            contract: contract._id,
            product: product.collectionIndexInContract,
            lockedCopies: { $gt: 0 },
          });

          if (!locks?.length) {
            return res
              .status(404)
              .send({ success: false, message: 'No locks found' });
          }

          return res.json({ success: true, locks });
        } catch (err) {
          return next(err);
        }
      },
      findOffersForProductMiddleware: async (req, res, next) => {
        try {
          const { contract, product } = req;
          req.token = req.params.token;

          if (contract.diamond) {
            const offers = await Offer.find({
              contract: contract._id,
              product: product.collectionIndexInContract,
            }).distinct('diamondRangeIndex');
            if (_.isEmpty(offers)) {
              return res
                .status(404)
                .send({ success: false, message: 'Offers not found.' });
            }
            req.offers = offers;
          } else {
            const offerPool = await OfferPool.findOne({
              contract: contract._id,
              product: product.collectionIndexInContract,
            });
            if (_.isEmpty(offerPool)) {
              return res
                .status(404)
                .send({ success: false, message: 'OfferPool not found.' });
            }
            req.offerPool = offerPool;
          }
          return next();
        } catch (e) {
          return next(e);
        }
      },
      getSingleToken: async (req, res, next) => {
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

          const result = await MintedToken.findOne(options);

          if (result === null) {
            return next(new AppError('Token not found.', 404));
          }

          return res.json({ success: true, result });
        } catch (err) {
          return next(err);
        }
      },
      updateTokenMetadata: async (req, res, next) => {
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
            if (req.files?.length) {
              await Promise.all(
                _.map(req.files, async (file) => {
                  await fs.rm(`${file.destination}/${file.filename}`);
                  log.info(`File ${file.filename} has removed.`);
                }),
              );
            }

            return next(new AppError(`You have no permissions for updating token ${token}.`, 403));
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

            return next(new AppError('Nothing to update.', 400));
          }

          const countDocuments = await MintedToken.countDocuments(
            options,
          );

          if (countDocuments === 0) {
            if (req.files?.length) {
              await Promise.all(
                _.map(req.files, async (file) => {
                  await fs.rm(`${file.destination}/${file.filename}`);
                  log.info(`File ${file.filename} has removed.`);
                }),
              );
            }

            return next(new AppError('Token not found.', 400));
          }

          if (req.files?.length) {
            const files = await Promise.all(
              _.map(req.files, async (file) => {
                try {
                  const cid = await addFile(file.destination, file.filename);
                  await addPin(cid, file.filename);

                  log.info(`File ${file.filename} has added to ipfs.`);

                  // eslint-disable-next-line no-param-reassign
                  file.link = `${config.pinata.gateway}/${cid}/${file.filename}`;

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

          if (req.files?.length) {
            await Promise.all(
              _.map(req.files, async (file) => {
                await fs.rm(`${file.destination}/${file.filename}`);
                log.info(`File ${file.filename} has removed.`);
              }),
            );
          }

          return res.json({ success: true, token: updatedToken });
        } catch (err) {
          if (req.files?.length) {
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
      pinSingleTokenMetadata: async (req, res, next) => {
        try {
          const { contract, offers, offerPool, token, user } = req;
          // eslint-disable-next-line prefer-regex-literals
          const reg = new RegExp(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
          );
          let metadataURI = 'none';

          if (user.publicAddress !== contract.user) {
            return next(new AppError(`You have no permissions for updating token ${token}.`, 403));
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

          const foundToken = await MintedToken.findOne(options);

          if (!foundToken) {
            return next(new AppError('Token not found.', 400));
          }

          metadataURI = foundToken.metadataURI;

          if (!_.isEmpty(foundToken.metadata)) {
            const CID = await addMetadata(foundToken.metadata, _.get(foundToken.metadata, 'name', 'none'));
            if (!CID) {
              return next(new AppError('Error uploading file', 500));
            }
            await addPin(CID, `metadata_${_.get(foundToken.metadata, 'name', 'none')}`);
            metadataURI = `${ipfsGateway}${CID}`;
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
      },
};
