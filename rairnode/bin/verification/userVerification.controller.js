const express = require('express');
const { isAdmin, requireUserSession } = require('../middleware');

const router = express.Router();

router.get('/jwt', requireUserSession, async (req, res, next) => {
  try {
    const { user } = req;
    res.json(user);
  } catch (e) {
    next(e);
  }
});
router.get(
  '/',
  requireUserSession,
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
