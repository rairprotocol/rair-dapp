const express = require('express');
const { validation, requireUserSession } = require('../../middleware');
const usersService = require('./users.Service');
const upload = require('../../Multer/Config');

const router = express.Router();

router.post('/', validation(['createUser']), usersService.createUser);

// Common for the group of routes below validation
router.use('/:publicAddress', validation(['singleUser'], 'params'));

router
  .route('/:publicAddress')
  .get(usersService.getUserByAddress)
  // Was POST in V1, no difference in usage, just standard
  .patch(
    requireUserSession,
    upload.array('files', 2),
    validation(['updateUser']),
    usersService.updateUserByUserAddress,
  );

module.exports = router;