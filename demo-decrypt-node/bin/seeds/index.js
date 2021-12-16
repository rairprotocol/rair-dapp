const log = require('../utils/logger')(module);
const categories = require('./categories');
const blockchains = require('./blockchains');

module.exports = async (context) => {
  try {
    await context.db.Category.insertMany(categories, { ordered: false });
  } catch (e) {}

  log.info('Categories was seeded.');

  try {
    await context.db.Blockchain.insertMany(blockchains, { ordered: false });
  } catch (e) {}

  log.info('Blockchains was seeded.');
}
