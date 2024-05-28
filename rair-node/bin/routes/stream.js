const express = require('express');
const url = require('url');
const { validation, streamVerification } = require('../middleware');
const { MediaViewLog } = require('../models');
const log = require('../utils/logger')(module);

const updateVideoAnalytics = async (req, res, next) => {
  if (req.session) {
    const { viewLogId } = req.session;
    const viewData = await MediaViewLog.findById(viewLogId);
    const requestedFile = url.parse(req.url).pathname;
    if (viewData && requestedFile.includes('.ts')) {
      if (viewData.decryptedFiles >= 0) {
        viewData.decryptedFiles += 1;
        viewData.save();
      }
    }
  } else {
    log.error(`Media file ${req.url} is being watched without a session`);
  }
  return next();
};

module.exports = (context) => {
  const router = express.Router();
  router.use(
    '/:mediaId',
    streamVerification,
    validation(['stream'], 'params'),
    updateVideoAnalytics,
    context.hls.middleware,
  );

  return router;
};
