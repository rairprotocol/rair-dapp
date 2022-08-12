const express = require('express');
const { JWTVerification, isAdmin, isSuperAdmin } = require('../middleware');

module.exports = () => {
  const router = express.Router();

  router.get('/', JWTVerification, isAdmin, isSuperAdmin, async (req, res, next) => {
    try {
      const userAdmin = req.user;
      res.json(userAdmin);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
