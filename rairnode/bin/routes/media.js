const express = require('express');
const _ = require('lodash');
const { ObjectId } = require('mongodb');
const { retrieveMediaInfo, addPin, removePin } = require('../integrations/ipfsService')();
const {
  validation,
  isOwner,
  requireUserSession,
  loadUserSession,
} = require('../middleware');
const log = require('../utils/logger')(module);

const { checkFileAccess } = require('../utils/helpers');
const config = require('../config/index');
const gcp = require('../integrations/gcp')(config);
const {
  Blockchain,
  Contract,
  File,
  User,
  Unlock,
} = require('../models');

module.exports = () => {
  const router = express.Router();
  /**
   * @swagger
   *
   * /api/media/add/{mediaId}:
   *   post:
   *     description: Register a new piece of media.Optionally provide a decrypt key.
  *                    Also pins the content in the provided IPFS store
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: mediaId
   *         description: The IPFS content identifier (CID) for a RAIR compatible media
   *                      folder. Must contain a rair.json manifest.
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       description: A .key file containing the private key for
   *                    this media stream in binary encoding
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
  router.post(
    '/add/:mediaId',
    validation(['addMedia'], 'params'),
    async (req, res, next) => {
      const key = req.body.length > 0 ? req.body : undefined;
      const { mediaId } = req.params;

      // lookup in IPFS at CID for a rair.json manifest
      try {
        const meta = await retrieveMediaInfo(mediaId);

        await File.create({ _id: mediaId, key, ...meta });
        await addPin(mediaId, _.get(meta, 'title', 'New_pinned_file'));
        res.sendStatus(200);
      } catch (e) {
        next(
          new Error(
            `Cannot retrieve rair.json manifest for ${mediaId}. Check the CID is correct and is a folder containing a manifest. ${e}`,
          ),
        );
      }
    },
  );

  router.patch(
    '/update/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    validation(['updateMedia'], 'body'),
    isOwner(File),
    async (req, res, next) => {
      try {
        const { mediaId } = req.params;

        // eslint-disable-next-line no-unused-vars
        const { _id, ...cleanBody } = req.body;

        if (!req.user.adminRights) {
          // eslint-disable-next-line no-unused-vars
          const { contract, offer, product, demo, bodyForNonAdmins } = cleanBody;
          req.body = bodyForNonAdmins;
        }

        const updateRes = await File.updateOne({ _id: mediaId }, cleanBody);

        if (!updateRes.acknowledged) {
          return res.json({ success: false, message: 'An error has ocurred' });
        }
        if (updateRes.matchedCount === 1 && updateRes.modifiedCount === 0) {
          return res.json({ success: false, message: 'Nothing to update' });
        }
        log.info(`File with ID: ${mediaId}, was updated on DB.`);
        return res.json({ success: true });
      } catch (err) {
        return next(err);
      }
    },
  );

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
  router.delete(
    '/remove/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    isOwner(File),
    async (req, res, next) => {
      try {
        const { mediaId } = req.params;

        const fileData = await File.findOne({ _id: mediaId });

        let deleteResponse;
        if (!fileData.storage) {
          log.error(`Can't tell where media ID ${mediaId} is stored, will not unpin/delete from storage, just from DB`);
          deleteResponse = { success: true };
        } else {
          switch (fileData.storage) {
            case 'gcp':
              deleteResponse = await gcp.removeFile(config.gcp.videoBucketName, mediaId);
            break;
            case 'ipfs':
              deleteResponse = await removePin(mediaId);
            break;
            default:
              log.error(`Unknown storage type for media ID ${mediaId} : ${fileData.storage}`);
            break;
          }
        }

        if (deleteResponse.success) {
          await File.deleteOne({ _id: mediaId });
          await Unlock.deleteMany({ file: mediaId });
          log.info(`File with ID: ${mediaId}, was removed from DB.`);
          res.json({
            success: true,
          });
          return;
        }

        res.json({
          success: false,
          message: deleteResponse.response,
        });
      } catch (err) {
        next(err);
      }
    },
  );

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
  router.get(
    '/list',
    validation(['filterAndSort', 'pagination'], 'query'),
    loadUserSession,
    async (req, res, next) => {
      try {
        const {
          pageNum = '1',
          itemsPerPage = '20',
          blockchain = '',
          category = [],
          userAddress = '',
          contractAddress = '',
          contractTitle = '',
          mediaTitle = '',
        } = req.query;
        const pageSize = parseInt(itemsPerPage, 10);
        const skip = (parseInt(pageNum, 10) - 1) * pageSize;

        const foundUser = await User.findOne({ publicAddress: userAddress });

        const foundBlockchain = await Blockchain.findOne({
          hash: blockchain, display: { $ne: true },
        });
        const contractQuery = {
          blockView: false,
        };
        if (foundBlockchain) {
          contractQuery.blockchain = blockchain;
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
          }, {
            demo: true,
          }],
          hidden: { $ne: true },
        };

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

        let data = (await File.aggregate([
          ...pipeline,
          { $skip: skip },
          { $limit: pageSize },
        ]));

        const [countResult] = await File.aggregate([...pipeline, { $count: 'totalCount' }]);

        const { totalCount } = countResult || 0;

        // verify the user have needed tokens for unlock the files
        data = await checkFileAccess(data, req.user);

        const list = _.chain(data)
          .reduce((result, value) => {
          // eslint-disable-next-line no-param-reassign
            result[value._id] = value;
            return result;
          }, {})
          .value();

        return res.json({ success: true, list, totalNumber: totalCount });
      } catch (e) {
        log.error(e);
        return next(e.message);
      }
    },
  );

  return router;
};
