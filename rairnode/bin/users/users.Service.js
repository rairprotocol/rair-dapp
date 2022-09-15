/* eslint-disable no-param-reassign */
const _ = require('lodash');
const config = require('../config');
const gcp = require('../integrations/gcp')(config);
const log = require('../utils/logger')(module);
const { cleanStorage, textPurify } = require('../utils/helpers');
const { User } = require('../models');
const AppError = require('../utils/appError');
const eFactory = require('../utils/entityFactory');

exports.getAllUsers = eFactory.getAll(User);
exports.getUserById = eFactory.getOne(User);

// for Contract service to enrich data with User Address
exports.addUserAdressToFilterById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new AppError('No user with such ID', 404));
    }
    req.query.user = user.publicAddress;
    next();
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    let { publicAddress } = req.body;

    publicAddress = publicAddress.toLowerCase();

    const addUser = await User.create({ publicAddress });

    const user = _.omit(addUser.toObject(), ['nonce']);

    res.status(201).json({ success: true, user });
  } catch (e) {
    next(e);
  }
};
exports.getUserByAddress = async (req, res, next) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase();
    const user = await User.findOne({ publicAddress }, { nonce: 0 });
    if (!user) {
      return next(new AppError('No User found with that Public Address', 404));
    }
    return res.status(200).json({ success: true, user });
  } catch (e) {
    return next(e);
  }
};
exports.updateUserByUserAddress = async (req, res, next) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase();
    const foundUser = await User.findOne({ publicAddress });
    const { user } = req;
    let fieldsForUpdate = _.assign({}, req.body);

    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    if (publicAddress !== user.publicAddress) {
      return res.status(403).json({
        success: false,
        message: `You have no permissions for updating user ${publicAddress}.`,
      });
    }
    if (req.files) {
      if (req.files.length) {
        const files = await Promise.all(
          _.map(req.files, async (file) => {
            try {
              const fileLink = await gcp.uploadFile(
                config.gcp.imageBucketName,
                file,
              );

              if (fileLink) {
                log.info(`File ${file.filename} has added to GCP bucket.`);

                file.link = `${config.gcp.gateway}/${config.gcp.imageBucketName}/${fileLink}`;
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

        fieldsForUpdate = _.pick(fieldsForUpdate, [
          'nickName',
          'avatar',
          'email',
          'background',
        ]);

        await cleanStorage(req.files);
      } else {
        fieldsForUpdate = _.pick(fieldsForUpdate, ['nickName', 'email']);
      }
    }
    if (_.isEmpty(fieldsForUpdate)) {
      return res
        .status(400)
        .json({ success: false, message: 'Nothing to update.' });
    }

    if (fieldsForUpdate.nickName) {
      fieldsForUpdate.nickName = textPurify.sanitize(fieldsForUpdate.nickName);
    }

    const updatedUser = await User.findOneAndUpdate(
      { publicAddress },
      fieldsForUpdate,
      { new: true, projection: { nonce: 0 } },
    );

    return res.json({ success: true, user: updatedUser });
  } catch (e) {
    return next(e);
  }
};
