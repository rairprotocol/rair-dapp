const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../middleware');
const { nanoid } = require('nanoid');
const upload = require('../Multer/Config.js');
const { execPromise } = require('../utils/helpers');

const removeTempFile = async (roadToFile) => {
  const command = `rm ${ roadToFile }`;
  await execPromise(command);
};

module.exports = context => {
  const router = express.Router();

  router.post('/', validation('createUser'), async (req, res, next) => {
    try {
      let { publicAddress, adminNFT } = req.body;

      if (adminNFT === 'temp') {
        adminNFT = `temp_${ nanoid() }`; //FIXME: should be removed right after fix the frontend functionality
      }

      publicAddress = publicAddress.toLowerCase();

      let user = await context.db.User.create({ publicAddress, adminNFT });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  router.get('/:publicAddress', validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const user = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:publicAddress', upload.single('file'), JWTVerification(context), validation('updateUser'), validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const foundUser = await context.db.User.findOne({ publicAddress });
      const { user } = req;
      let fieldsForUpdate = _.assign({}, req.body);
      let avatar = '';

      if (!foundUser) {
        return res.status(404).send({ success: false, message: 'User not found.' });
      }

      if (publicAddress !== user.publicAddress) {
        return res.status(403).send({
          success: false,
          message: `You have no permissions for updating user ${ publicAddress }.`
        });
      }

      if (req.file) {
        avatar = await context.gcp.uploadFile(context, req.file);
        await removeTempFile(`${ req.file.destination }${ req.file.filename }`);

        if(!!avatar) {
          _.assign(fieldsForUpdate, { avatar });
        }
      }

      fieldsForUpdate = _.pick(fieldsForUpdate,['adminNFT', 'nickName', 'avatar', 'email']);

      if (_.isEmpty(fieldsForUpdate)) {
        return res.status(400).send({ success: false, message: 'Nothing to update.' });
      }

      const updatedUser = await context.db.User.findOneAndUpdate({ publicAddress }, fieldsForUpdate, { new: true });

      return res.json({ success: true, user: updatedUser });
    } catch (e) {
      if (req.file) {
        await removeTempFile(`${ req.file.destination }${ req.file.filename }`);
      }

      next(e);
    }
  });

  return router;
};