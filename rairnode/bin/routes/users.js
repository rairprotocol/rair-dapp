const express = require('express');
const _ = require('lodash');
const { nanoid } = require('nanoid');
const { JWTVerification, validation } = require('../middleware');
const upload = require('../Multer/Config');
const { cleanStorage } = require('../utils/helpers');

module.exports = (context) => {
  const router = express.Router();

  // Create new user
  router.post('/', validation('createUser'), async (req, res, next) => {
    try {
      let { publicAddress } = req.body;

      publicAddress = publicAddress.toLowerCase();

      const addUser = await context.db.User.create({ publicAddress });

      const user = _.omit(addUser.toObject(), ['nonce']);

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  // Get specific user info
  router.get('/:publicAddress', validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const user = await context.db.User.findOne({ publicAddress }, { nonce: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  // Update specific user fields
  router.post('/:publicAddress', JWTVerification, upload.single('file'), validation('updateUser'), validation('singleUser', 'params'), async (req, res, next) => {
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
        await cleanStorage(req.file);

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
        { new: true, projection: { nonce: 0 } },
      );

      return res.json({ success: true, user: updatedUser });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};
