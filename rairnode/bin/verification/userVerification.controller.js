const express = require('express');
const { verifyUserSession, isAdmin } = require('../middleware');

const router = express.Router();

router.get('/jwt', verifyUserSession, async (req, res, next) => {
  try {
    const { user } = req;
    res.json(user);
  } catch (e) {
    next(e);
  }
});
router.get(
  '/',
  verifyUserSession,
  isAdmin,
  async (req, res, next) => {
    try {
      const userAdmin = req.user;
      res.json(userAdmin);
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;
