const express = require('express');
const _ = require('lodash');
const { nanoid } = require('nanoid');
const { JWTVerification, validation } = require('../middleware');
const upload = require('../Multer/Config');
const { execPromise } = require('../utils/helpers');

const removeTempFile = async (roadToFile) => {
  const command = `rm ${roadToFile}`;
  await execPromise(command);
};

module.exports = (context) => {
  const router = express.Router();

  // Create new user
  router.post('/', validation('createUser'), async (req, res, next) => {
    // FIXME: endpoint have to be protected

    try {
      // let { publicAddress, adminNFT } = req.body;
      let { publicAddress } = req.body;

      const adminNFT = `temp_${nanoid()}`; // FIXME: should be removed right after fix the frontend functionality

      publicAddress = publicAddress.toLowerCase();

      const user = await context.db.User.create({ publicAddress, adminNFT });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  // Get specific user info
  router.get('/:publicAddress', validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const user = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  // Update specific user fields
  // MB: TODO: validate then upload
  router.post('/:publicAddress', upload.single('file'), JWTVerification(context), validation('updateUser'), validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const foundUser = await context.db.User.findOne({ publicAddress });
      const { user } = req;
      let fieldsForUpdate = _.assign({}, req.body);
      let avatarFile = '';

      if (!foundUser) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      if (publicAddress !== user.publicAddress) {
        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating user ${publicAddress}.`,
        });
      }

      if (req.file) {
        avatarFile = await context.gcp.uploadFile(context.config.gcp.imageBucketName, req.file);
        await removeTempFile(`${req.file.destination}${req.file.filename}`);

        if (avatarFile) {
          _.assign(fieldsForUpdate, { avatar: `${context.config.gcp.gateway}/${context.config.gcp.imageBucketName}/${avatarFile}` });
        }
      }

      fieldsForUpdate = _.pick(fieldsForUpdate, ['nickName', 'avatar', 'email']);

      if (_.isEmpty(fieldsForUpdate)) {
        return res.status(400).send({ success: false, message: 'Nothing to update.' });
      }

      if (fieldsForUpdate.nickName) {
        fieldsForUpdate.nickName = context.textPurify.sanitize(fieldsForUpdate.nickName);
      }

      const updatedUser = await context.db.User.findOneAndUpdate(
        { publicAddress },
        fieldsForUpdate,
        { new: true },
      );

      return res.json({ success: true, user: updatedUser });
    } catch (e) {
      if (req.file) {
        await removeTempFile(`${req.file.destination}${req.file.filename}`);
      }

      return next(e);
    }
  });

  return router;
};
