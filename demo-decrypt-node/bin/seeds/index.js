const log = require('../utils/logger')(module);
const categories = require('./categories');
const blockchains = require('./blockchains');

module.exports = async (context) => {
  try {
    await context.db.Category.insertMany(categories, { ordered: false });

    log.info('Categories was seeded.');

    await context.db.Blockchain.insertMany(blockchains, { ordered: false });

    log.info('Blockchains was seeded.');
  } catch (e) {}
}
