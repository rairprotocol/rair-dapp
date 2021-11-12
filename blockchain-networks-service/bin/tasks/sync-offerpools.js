const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { minterAbi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync offerPools', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const offerPoolsForSave = [];
      const block_number = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(minterAbi, 'event', 'AddedOffer');
      const version = await context.db.Versioning.findOne({ name: 'sync offerPools', network });

      const options = {
        address: networkData.minterAddress,
        chain: networkData.network,
        topic,
        abi,
        from_block: _.get(version, ['number'], 0)
      };

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId });

      const events = await Moralis.Web3API.native.getContractEvents(options);

      _.forEach(events.result, offerPool => {
        const {
          contractAddress,
          productIndex,
          rangesCreated,
          catalogIndex
        } = offerPool.data;

        block_number.push(Number(offerPool.block_number));

        offerPoolsForSave.push({
          marketplaceCatalogIndex: catalogIndex,
          contract: contractAddress,
          product: productIndex,
          rangeNumber: rangesCreated
        });
      });

      if (!_.isEmpty(offerPoolsForSave)) {
        try {
          await context.db.OfferPool.insertMany(offerPoolsForSave, { ordered: false });
        } catch (e) {}
      }

      if (!_.isEmpty(block_number)) {
        await context.db.Versioning.updateOne({
          name: 'sync offerPools',
          network
        }, { number: _.chain(block_number).sortBy().last().value() }, { upsert: true });
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
