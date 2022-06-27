const express = require('express');
const models = require('../models');
const searchService = require('./search.Service');

const router = express.Router();
// const dbSearch = _.pick(dbContext.db, 'User', 'Product', 'MintedToken')
router.get('/:textParam', searchService.globalSearch(models));
router.get('/:textParam/all', searchService.globalSearch(models, true));

module.exports = router;
