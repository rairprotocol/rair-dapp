const { File, MintedToken, Unlock } = require('../../models');
const AppError = require('../../utils/errors/AppError');

exports.getFiles = async (req, res) => {
  const { query } = req;
  const dataQuery = {
    ...query,
  };
  if (!req.session.userData.superAdmin) {
    dataQuery.uploader = req.session.userData.publicAddress;
  }

  const result = await File.find().sort({ title: 1 }).populate({ path: 'category', model: 'Category' });

  return res.status(200).json({
    success: true,
    data: result,
  });
};

exports.getFile = async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    const file = await File.findById(id, '-key')
      .populate({ path: 'category', model: 'Category' });
    res.json({ success: true, file });
  }
};

exports.updateFile = async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    await File.findByIdAndUpdate(id, {
      $set: {
        ...req.body,
      },
    });
    res.json({ success: true });
  }
};

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

exports.getFilesByCategory = async (req, res) => {
  const { id } = req.params;
  const { pageNum = '1', itemsPerPage = '20' } = req.query;
  const pageSize = parseInt(itemsPerPage, 10);
  const skip = (parseInt(pageNum, 10) - 1) * pageSize;

  const results = await File.find({ category: id }, '-key')
    .skip(skip)
    .limit(pageSize);
  const totalCount = await File.find({ category: id }).countDocuments();

  res.json({
    success: true,
    totalCount,
    files: results,
  });
};

exports.connectFileAndOffer = async (req, res) => {
  const { id } = req.params;
  const { offers } = req.body;
  let dataExists = await Unlock.findOne({
    file: id,
  });
  if (!dataExists) {
    dataExists = new Unlock({
      file: id,
      offers: [],
    });
  }
  // eslint-disable-next-line no-restricted-syntax
  for await (const offer of offers) {
    if (!dataExists.offers.includes(offer)) {
      dataExists.offers.push(offer);
    }
  }
  await dataExists.save();
  await File.updateOne({
    _id: id,
  }, { $set: {
    demo: false,
  } });
  return res.json({
    success: true,
    offer: dataExists,
  });
};

exports.removeFileAndOffer = async (req, res) => {
  const { id } = req.params;
  const { offer } = req.body;
  const dataExists = await Unlock.findOne({
    file: id,
  });
  if (!dataExists) {
    return new AppError('No unlock data found');
  }
  if (dataExists.offers.includes(offer)) {
    dataExists.offers.splice(dataExists.offers.indexOf(offer), 1);
  }
  await dataExists.save();
  if (dataExists.offers.length === 0) {
    await File.updateOne({
      _id: id,
    }, { $set: {
      demo: true,
    } });
  }
  return res.json({
    success: true,
    offer: dataExists,
  });
};

exports.getFileAndOffer = async (req, res) => {
  const { id } = req.params;
  const data = await Unlock.findOne({
    file: id,
  }).populate({
    path: 'offers',
    populate: {
      path: 'contract',
      model: 'Contract',
    },
  });
  return res.json({
    success: true,
    data,
  });
};
