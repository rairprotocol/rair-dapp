const express = require('express');
const { validation, requireUserSession, isAdmin, loadUserSession } = require('../../middleware');
const {
  createUser,
  getUserByAddress,
  updateUserByUserAddress,
  listUsers,
  exportUsers,
  yotiVerify,
  queryGithubData,
} = require('./users.Service');
const upload = require('../../Multer/Config');

const router = express.Router();

router.get(
  '/list',
  validation(['customUserFields', 'pagination'], 'query'),
  loadUserSession,
  listUsers,
);
router.get(
  '/export',
  requireUserSession,
  isAdmin,
  exportUsers,
);

router.post(
  '/verify-age',
  requireUserSession,
  yotiVerify,
);

router.post(
  '/',
  validation(['createUser']),
  createUser,
);

// Common for the group of routes below validation
router.use('/:userAddress', validation(['userAddress'], 'params'));
router
  .route('/:publicAddress')
  .get(getUserByAddress)
  .patch(
    requireUserSession,
    upload.array('files', 2),
    validation(['updateUser']),
    updateUserByUserAddress,
    queryGithubData,
  );

module.exports = router;
