const log = require('../utils/logger')(module);
const categories = require('./categories');
const syncRestrictions = require('./syncRestrictions');
const { Category, ServerSetting, Contract, Blockchain } = require('../models');

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

  // Populate CORE blockchain
  try {
    const coreExists = await Blockchain.findOne({ hash: '0x2105' });
    if (!coreExists) {
      await Blockchain.create(
        {
          hash: '0x2105',
          name: 'Base',
          display: true,
          sync: true,
          alchemySupport: false,
          blockExplorerGateway: 'https://basescan.org',
          diamondFactoryAddress: '0x1F89Cc515dDc53dA2fac5B0Ca3b322066A71E6BA',
          diamondMarketplaceAddress: '0x58795f50b50d492C4252B9BBF78485EF4043FF3E',
          mainTokenAddress: '0x2b0fFbF00388f9078d5512256c43B983BB805eF8',
          numericalId: 8453,
          rpcEndpoint: 'https://base.meowrpc.com',
          symbol: 'ETH',
          testnet: false,
        },
      );
    }
  } catch (err) {
    log.info('Error populating Core chain');
  }
};
