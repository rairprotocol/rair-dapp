const express = require('express');
const { JWTVerification, isAdmin, isSuperAdmin } = require('../middleware');

const router = express.Router();

router.get('/jwt', JWTVerification, async (req, res, next) => {
  try {
    const { user } = req;
    res.json(user);
  } catch (e) {
    next(e);
  }
});
router.get(
  '/',
  JWTVerification,
  isAdmin,
  isSuperAdmin,
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
