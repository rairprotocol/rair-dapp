const log = require('../utils/logger')(module);
const categories = require('./categories');
const blockchains = require('./blockchains');
const syncRestrictions = require('./syncRestrictions');
const _ = require('lodash');

module.exports = async (context) => {
  try {
    await context.db.Category.insertMany(categories, { ordered: false });
  } catch (e) {}

  log.info('Categories was seeded.');

  try {
    await context.db.Blockchain.insertMany(blockchains, { ordered: false });
  } catch (e) {}

  log.info('Blockchains was seeded.');

  try {
    const resultSyncRestrictions = _.map(syncRestrictions, (sr) => ({
      updateOne: {
        filter: _.pick(sr, ['blockchain', 'contractAddress']),
        update: _.omit(sr, ['blockchain', 'contractAddress']),
        upsert: true,
      },
    }));

    await context.db.SyncRestriction.bulkWrite(resultSyncRestrictions, { ordered: false });
  } catch (e) {}

  log.info('SyncRestrictions was seeded.');
};
