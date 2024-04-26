const { Router } = require('express');
const { validation } = require('../../middleware');
const models = require('../../models');
const searchService = require('./search.Service');

const router = Router();
// const dbSearch = _.pick(dbContext.db, 'User', 'Product', 'MintedToken')
router.get('/:textParam', validation(['textSearch'], 'params'), searchService.globalSearch(models));
router.get('/:textParam/all', validation(['textSearch'], 'params'), searchService.globalSearch(models, true));

module.exports = router;
