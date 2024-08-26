const log = require('../utils/logger')(module);
const categories = require('./categories');
const syncRestrictions = require('./syncRestrictions');
const { Category, ServerSetting, Contract } = require('../models');

module.exports = async () => {
  try {
    const count = await Category.estimatedDocumentCount();
    if (count === 0) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const category of categories) {
        await Category.findOneAndUpdate(
          category,
          category,
          { upsert: true, new: true },
        );
      }
      log.info('Categories empty, populating with default values.');
    }
  } catch (e) {
    log.error(`Error seeding categories: ${e}`);
  }

  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const restrictedContract of syncRestrictions) {
      await Contract.findOneAndUpdate(
        restrictedContract,
        { $set: { blockSync: true } },
        { upsert: true, new: true },
      );
    }
  } catch (e) {
    log.error(`Error seeding restricted contracts: ${e}`);
  }
  log.info('Restricted contracts seeded.');

  const serverSetting = await ServerSetting.findOne({});
  if (!serverSetting) {
    await ServerSetting.create({
      onlyMintedTokensResult: false,
    });
    log.info('Server settings set by default!');
  }
};
