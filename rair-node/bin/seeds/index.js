const log = require('../utils/logger')(module);
const categories = require('./categories');
const blockchains = require('./blockchains');
const syncRestrictions = require('./syncRestrictions');
const { Blockchain, Category, ServerSetting, Contract } = require('../models');

module.exports = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const category of categories) {
      await Category.findOneAndUpdate(
        category,
        category,
        { upsert: true, new: true },
      );
    }
  } catch (e) {
    log.error(`Error seeding categories: ${e}`);
  }
  log.info('Categories seeded.');

  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const blockchain of blockchains) {
      await Blockchain.findOneAndUpdate(
        blockchain,
        blockchain,
        { upsert: true, new: true },
      );
    }
  } catch (e) {
    log.error(`Error seeding blockchains: ${e}`);
  }
  log.info('Blockchains seeded.');

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
