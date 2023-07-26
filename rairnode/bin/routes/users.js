const express = require('express');
const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const { validation, requireUserSession } = require('../middleware');
const upload = require('../Multer/Config');
const { cleanStorage } = require('../utils/helpers');
const { User } = require('../models');
const log = require('../utils/logger')(module);

module.exports = (context) => {
  const router = express.Router();

  // Create new user
  router.post('/', validation(['createUser']), async (req, res, next) => {
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
  router.get('/:userAddress', validation(['userAddress'], 'params'), async (req, res, next) => {
    try {
      const { userAddress } = req.params;
      const user = await User.findOne({
        publicAddress: userAddress.toLowerCase(),
      }, { nonce: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  // Update specific user fields
  router.post(
    '/:userAddress',
    requireUserSession,
    upload.array('files', 2),
    validation(['updateUser']),
    validation(['userAddress'], 'params'),
    async (req, res, next) => {
      try {
        const publicAddress = req.params.userAddress.toLowerCase();
        const foundUser = await User.findOne({ publicAddress });
        const { user } = req;
        let fieldsForUpdate = _.assign({}, req.body);

        if (!foundUser) {
          return next(new AppError('User not found.', 404));
        }

        if (publicAddress !== user.publicAddress) {
          return next(new AppError(`You have no permissions for updating user ${publicAddress}.`, 403));
        }

        if (req?.files?.length) {
          const files = await Promise.all(
            _.map(req.files, async (file) => {
              try {
                const fileLink =
                  await context.gcp.uploadFile(context.config.gcp.imageBucketName, file);

                if (fileLink) {
                  log.info(`File ${file.filename} has added to GCP bucket.`);

                  // eslint-disable-next-line no-param-reassign
                  file.link = `${context.config.gcp.gateway}/${context.config.gcp.imageBucketName}/${fileLink}`;
                }

                return file;
              } catch (err) {
                log.error(err);

                return err;
              }
            }),
          );

          _.chain(fieldsForUpdate)
            .pick(['avatar', 'background'])
            .forEach((value, key) => {
              const v = _.chain(files)
                .find((f) => f.originalname === value)
                .get('link')
                .value();

              if (v) fieldsForUpdate[key] = v;
              else delete fieldsForUpdate[key];
            })
            .value();

          fieldsForUpdate = _.pick(fieldsForUpdate, ['nickName', 'avatar', 'email', 'background', 'ageVerified']);

          await cleanStorage(req.files);
        } else {
          fieldsForUpdate = _.pick(fieldsForUpdate, ['nickName', 'email', 'ageVerified']);
        }

        if (_.isEmpty(fieldsForUpdate)) {
          return next(new AppError('Nothing to update.', 400));
        }

        if (fieldsForUpdate.nickName) {
          fieldsForUpdate.nickName = context.textPurify.sanitize(fieldsForUpdate.nickName);
        }

        const updatedUser = await User.findOneAndUpdate(
          { publicAddress },
          fieldsForUpdate,
          { new: true, projection: { nonce: 0 } },
        );

        req.session.userData = {
          ...req.session.userData,
          ...fieldsForUpdate,
        };

        return res.json({ success: true, user: updatedUser });
      } catch (e) {
        return next(e);
      }
    },
  );

  return router;
};
