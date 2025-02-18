const { ObjectId } = require('mongodb');
const {
  File,
  MintedToken,
  Unlock,
  Offer,
  User,
  Blockchain,
  Contract,
} = require('../../models');
const log = require('../../utils/logger')(module);
const AppError = require('../../utils/errors/AppError');
const { removePin } = require('../../integrations/ipfsService')();
const { checkFileAccess } = require('../../utils/helpers');
const config = require('../../config');
const gcp = require('../../integrations/gcp')(config);

module.exports = {
  isFileOwner: async (req, res, next) => {
    const { publicAddress, superAdmin } = req.user;
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return next(new AppError('No file found'));
    }
    if (file.uploader !== publicAddress && !superAdmin) {
      return next(new AppError('Cannot manage data'));
    }
    return next();
  },
  listMedia: async (req, res, next) => {
    try {
      const {
        pageNum = '1',
        itemsPerPage = '20',
        blockchain = [],
        category = [],
        userAddress = '',
        contractAddress = '',
        contractTitle = '',
        mediaTitle = '',
      } = req.query;
      const pageSize = parseInt(itemsPerPage, 10);
      const skip = (parseInt(pageNum, 10) - 1) * pageSize;
      const { hidden = 'false' } = req.query;

      const foundUser = await User.findOne({ publicAddress: userAddress });

      const blockchainFilter = {
        display: { $ne: false },
      };
      if (blockchain.length) {
        blockchainFilter.hash = { $in: [...blockchain] };
      }
      const foundBlockchain = await Blockchain.find(blockchainFilter);

      const contractQuery = {
        blockView: false,
      };
      if (foundBlockchain.length !== undefined) {
        contractQuery.blockchain = { $in: foundBlockchain.map((chain) => chain.hash) };
      }
      if (contractAddress) {
        contractQuery.contractAddress = contractAddress;
      }
      if (contractTitle) {
        contractQuery.title = { $regex: contractTitle, $options: 'i' };
      }
      const arrayOfContracts = await Contract.find(contractQuery).distinct(
        '_id',
      );
      const matchData = {
        $or: [{
          'unlockData.offers.contract': {
            $in: arrayOfContracts,
          },
        }],
      };

      if (!blockchain.length) {
        matchData.$or.push({
          demo: true,
        });
      }

      if (hidden === 'true') {
        matchData.hidden = true;
      } else {
        matchData.hidden = { $ne: true }; // For undefined and false cases
      }

      if (category.length) {
        matchData.category = { $in: category.map((cat) => new ObjectId(cat)) };
      }

      if (foundUser) {
        matchData.uploader = userAddress;
      }

      if (mediaTitle !== '') {
        matchData.title = { $regex: mediaTitle, $options: 'i' };
      }

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
        },
        {
          $match: matchData,
        }, {
          $lookup: {
            from: 'Category',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        }, {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            key: false,
            encryptionType: false,
            totalEncryptedFiles: false,
            extension: false,
          },
        }, {
          $sort: {
            title: 1,
          },
        },
      ];

      const [result] = await File.aggregate([
        ...pipeline,
        {
          $facet: {
            list: [
              { $skip: skip },
              { $limit: pageSize },
            ],
            count: [
              { $count: 'total' },
            ],
          },
        },
      ]);

      // verify the user have needed tokens for unlock the files
      const unlockCheck = await checkFileAccess(result.list, req.user);

      return res.json({
        success: true,
        list: unlockCheck,
        totalNumber: result?.count?.[0]?.total || 0,
      });
    } catch (e) {
      log.error(e);
      return next(e.message);
    }
  },
  deleteMedia: async (req, res, next) => {
    try {
      const { id } = req.params;

      const fileData = await File.findOne({ _id: id });

      if (!fileData) {
        return new AppError('No file found');
      }

      let deleteResponse;
      if (!fileData.storage) {
        log.error(`Can't tell where media ID ${id} is stored, will not unpin/delete from storage, just from DB`);
        deleteResponse = { success: true };
      } else {
        switch (fileData.storage) {
          case 'gcp':
            deleteResponse = await gcp.removeFile(config.gcp.videoBucketName, id);
          break;
          case 'ipfs':
            deleteResponse = await removePin(id);
          break;
          default:
            log.error(`Unknown storage type for media ID ${id} : ${fileData.storage}`);
          break;
        }
      }

      if (deleteResponse.success) {
        await File.deleteOne({ _id: id });
        await Unlock.deleteMany({ file: id });
        log.info(`File with ID: ${id}, was removed from DB.`);
        return res.json({
          success: true,
        });
      }

      return res.json({
        success: false,
        message: deleteResponse.response,
      });
    } catch (err) {
      return next(err);
    }
  },
  updateMedia: async (req, res, next) => {
    try {
      const { id } = req.params;

      // eslint-disable-next-line no-unused-vars
      const { _id, ...cleanBody } = req.body;

      if (!req.user.adminRights) {
        // eslint-disable-next-line no-unused-vars
        const { contract, offer, product, demo, bodyForNonAdmins } = cleanBody;
        req.body = bodyForNonAdmins;
      }

      const updateRes = await File.updateOne({ _id: id }, cleanBody);

      if (!updateRes.acknowledged) {
        return res.json({ success: false, message: 'An error has ocurred' });
      }
      if (updateRes.matchedCount === 1 && updateRes.modifiedCount === 0) {
        return res.json({ success: false, message: 'Nothing to update' });
      }
      log.info(`File with ID: ${id}, was updated on DB.`);
      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  },
  getFile: async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      const file = await File.findById(id, '-key')
        .populate({ path: 'category', model: 'Category' });
      res.json({ success: true, file });
    }
  },
  updateFile: async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      await File.findByIdAndUpdate(id, {
        $set: {
          ...req.body,
        },
      });
      res.json({ success: true });
    }
  },
  getFilesForToken: async (req, res, next) => {
    try {
      const { id } = req.params;

      const token = await MintedToken.findById(id);
      let files = [];
      if (token) {
        const offerData = await Offer.find({
          contract: token.contract,
          diamondRangeIndex: token.offer,
        });
        files = await Unlock.find({
          offers: { $all: offerData.map((offer) => offer._id) },
        }).populate('file');
      }

      return res.status(200).json({
        success: true,
        results: files.length,
        data: files,
      });
    } catch (err) {
      return next(err);
    }
  },
  getFilesByCategory: async (req, res) => {
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
  },
  connectFileAndOffer: async (req, res) => {
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
  },
  removeFileAndOffer: async (req, res) => {
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
  },
  getFileAndOffer: async (req, res) => {
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
  },
};
