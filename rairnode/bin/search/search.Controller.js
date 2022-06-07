const express = require('express');
// const _ = require('lodash');
const oldSearch = require('./search');
const searchService = require('./search.Service');

module.exports = (dbInjection) => {
  const router = express.Router();
  // const dbSearch = _.pick(dbContext.db, 'User', 'Product', 'MintedToken')
  router.get('/:textParam', searchService.globalSearch(dbInjection));
  router.get('/:textParam/all', searchService.globalSearch(dbInjection, true));
  router.post('/', oldSearch(dbInjection));
  return router;
};
