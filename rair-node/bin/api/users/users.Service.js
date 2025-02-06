/* eslint-disable no-param-reassign */
const fs = require('fs');
const { randomUUID } = require('crypto');
const path = require('path');
const { RequestBuilder, Payload } = require('yoti');
const fetch = require('node-fetch');
const config = require('../../config');
const gcp = require('../../integrations/gcp')(config);
const log = require('../../utils/logger')(module);
const { cleanStorage, textPurify } = require('../../utils/helpers');
const { User, ServerSetting } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const eFactory = require('../../utils/entityFactory');

exports.getAllUsers = eFactory.getAll(User);
exports.getUserById = eFactory.getOne(User);

exports.yotiVerify = async (req, res, next) => {
  try {
    const { YOTI_CLIENT_ID } = process.env;
    const { image } = req.body;

    if (!YOTI_CLIENT_ID || !image) {
      return res.json({
        success: false,
        message: 'Cannot process age verification',
      });
    }

    const data = {
      img: image,
      threshold: 25,
      operator: 'OVER',
      metadata: {
        device: 'unknown',
      },
    };

    const request = new RequestBuilder()
      .withBaseUrl('https://api.yoti.com/ai/v1')
      .withPemFilePath(path.join(__dirname, '../../', 'integrations', 'yoti', 'hotdrops.pem'))
      .withEndpoint('/age-antispoofing-verify')
      .withPayload(new Payload(data))
      .withMethod('POST')
      .withHeader('X-Yoti-Auth-Id', YOTI_CLIENT_ID)
      .build();

    const response = await request.execute();

    if (response.parsedResponse.age.age_check === 'pass') {
      await User.findByIdAndUpdate(req.user._id, { $set: {
        ageVerified: true,
      } });
      req.session.userData.ageVerified = true;
    }

    return res.json({
      success: true,
      data: response.parsedResponse,
    });
  } catch (err) {
    return next(err);
  }
};

const adminProtectedFields = [
  'email',
  'firstName',
  'lastName',
  'publicAddress',
  'nonce',
  'creationDate',
  'blocked',
  '_id',
];
exports.listUsers = async (req, res, next) => {
  try {
    const {
      fields = 'email,nickName,publicAddress,creationDate,blocked',
      pageNum = 0,
      itemsPerPage = 10,
    } = req.query;
    const queriedFields = {
      _id: 0,
    };
    fields?.split(',')?.forEach((field) => {
      if (adminProtectedFields.includes(field.toLowerCase()) && !req.user?.adminRights) {
        return;
      }
      queriedFields[field] = 1;
    });
    const [result] = await User.aggregate([
      {
        $project: queriedFields,
      },
      {
        $facet: {
          list: [
            { $skip: pageNum * itemsPerPage },
            { $limit: Number(itemsPerPage) },
          ],
          count: [
            { $count: 'total' },
          ],
        },
      },
    ]);
    return res.json({
      success: true,
      data: result.list,
      totalCount: result?.count?.[0]?.total || 0,
    });
  } catch (err) {
    return next(err);
  }
};

exports.exportUsers = async (req, res, next) => {
  try {
    const results = await User.find({}, {
      email: 1,
      nickName: 1,
      publicAddress: 1,
      creationDate: 1,
    });
    const delimiter = ';';
    const stringData = results.reduce((result, item) => {
        const line = `${item.creationDate.toUTCString()}${delimiter}${item.nickName}${delimiter}${item.publicAddress}${delimiter}${item.email}\n`;
        return `${result}${line}`;
    }, `Creation Date${delimiter}Nickname${delimiter}Public Address${delimiter}Email\n`);
    const fileName = path.join(__dirname, `UserExport-${(new Date()).toUTCString()}.csv`);

    fs.writeFileSync(fileName, stringData);

    await res.download(fileName);

    return setTimeout(() => {
        fs.rmSync(fileName);
    }, 2000);
  } catch (err) {
    return next(err);
  }
};

// for Contract service to enrich data with User Address
exports.addUserAdressToFilterById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
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

    if (await User.estimatedDocumentCount() === 0) {
      await ServerSetting.updateOne({}, { $set: {
        superAdmins: [publicAddress],
      } });
      log.info('First user registered, given super admin access');
    }

    const addUser = await User.create({ publicAddress });

    res.status(201).json({ success: true, user: addUser });
  } catch (e) {
    next(e);
  }
};

exports.getUserByAddress = async (req, res, next) => {
  try {
    const publicAddress = req.params.publicAddress.toLowerCase();
    const user = await User.findOne({ publicAddress }, { nonce: 0 });
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
    const fieldsForUpdate = { ...req.body };
    if (fieldsForUpdate.nickName) {
      const foundNickname = await User.findOne({ nickName: `@${fieldsForUpdate.nickName}` });
      if (foundNickname !== null && foundNickname.publicAddress !== publicAddress) {
        fieldsForUpdate.nickName += randomUUID();
      }
    }

    if (!foundUser) {
      return next(new AppError('User not found.', 404));
    }

    if (publicAddress !== user.publicAddress && !user.superAdmin) {
      return next(new AppError(`You have no permissions for updating user ${publicAddress}.`, 403));
    }

    if (req?.files?.length) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const file of req.files) {
        const target = Object.keys(req.body)
          .find((key) => req.body[key] === file.originalname);
        if (!target) {
          continue;
        }
        try {
          const fileLink = await gcp.uploadFile(
            config.gcp.imageBucketName,
            file,
          );
          if (fileLink) {
            log.info(`File ${file.filename} has added to GCP bucket.`);
            fieldsForUpdate[target] = `${config.gcp.gateway}/${config.gcp.imageBucketName}/${fileLink}`;
          }
        } catch (err) {
          log.error(err);
          return err;
        }
      }
      await cleanStorage(req.files);
    }
    if (Object.keys(fieldsForUpdate).length === 0) {
      return next(new AppError('Nothing to update.', 400));
    }

    if (fieldsForUpdate.nickName) {
      fieldsForUpdate.nickName = textPurify.sanitize(fieldsForUpdate.nickName);
    }

    const updatedUser = await User.findOneAndUpdate(
      { publicAddress },
      fieldsForUpdate,
      { new: true, projection: { nonce: 0 } },
    ).lean();

    req.session.userData = {
      ...req.session.userData,
      ...updatedUser,
    };

    return next();
  } catch (e) {
    return next(e);
  }
};

exports.queryGithubData = async (req, res, next) => {
  const { publicAddress, gitHandle } = req.session.userData;
  const { gitId } = req.body;
  if (gitHandle || !gitId || !Number.isInteger(Number(gitId))) {
    return res.json({ success: true, user: req.session.userData });
  }
  const query = await (await fetch(`https://api.github.com/user/${gitId}`)).json();
  if (query.login) {
    const updatedUser = await User.findOneAndUpdate({ publicAddress }, {
      gitHandle: query.login,
      gitBio: query.bio,
      // available: query.items[0].hireable,
      avatar: query.avatar_url,
    }, { new: true, projection: { nonce: 0 } }).lean();

    req.session.userData = {
      ...req.session.userData,
      ...updatedUser,
    };
    return res.json({ success: true, user: req.session.userData });
  }
  log.error("Couldn't fetch Github data");
  return res.json({ success: true, user: req.session.userData });
};
