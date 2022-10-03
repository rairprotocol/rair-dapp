const { File, MintedToken } = require('../models');
const eFactory = require('../utils/entityFactory');
const { verifyAccessRightsToFile } = require('../utils/helpers');

exports.getFiles = eFactory.getAll(File, { dataTransform: { func: verifyAccessRightsToFile, parameters: ['user'] } });

exports.getFilesForToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { product } = req.query;
    const { contract, offers, offerPool } = req;
    const sanitizedToken = token;
    const options = [
      {
        $lookup: {
          from: 'File',
          let: {
            contractT: '$contract',
            offerIndex: '$offer',
            productT: product,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$contract', '$$contractT'],
                    },
                    {
                      $eq: ['$product', '$$productT'],
                    },
                    {
                      $in: ['$$offerIndex', '$offer'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'files',
        },
      },
      { $unwind: '$files' },
      { $replaceRoot: { newRoot: '$files' } },
    ];

    if (contract.diamond) {
      options.unshift({
        $match: {
          contract: contract._id,
          offer: { $in: offers },
          token: sanitizedToken,
        },
      });
    } else {
      options.unshift({
        $match: {
          contract: contract._id,
          offerPool: offerPool.marketplaceCatalogIndex,
          token: sanitizedToken,
        },
      });
    }

    const doc = await MintedToken.aggregate(options);

    return res.status(200).json({
      success: true,
      results: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return next(err);
  }
};
