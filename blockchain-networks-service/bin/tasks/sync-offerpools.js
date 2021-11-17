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
      let block_number = null;
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

      await Promise.all(_.map(events.result, async offerPool => {
        const {
          contractAddress,
          productIndex,
          rangesCreated,
          catalogIndex
        } = offerPool.data;
        const contract = await context.db.Contract.findOne({ contractAddress: contractAddress.toLowerCase(), blockchain: network }, { _id: 1 });

        block_number.push(Number(offerPool.block_number));

        offerPoolsForSave.push({
          marketplaceCatalogIndex: catalogIndex,
          contract: contract._id,
          product: productIndex,
          rangeNumber: rangesCreated,
          minterAddress: networkData.minterAddress,
        });

        block_number = Number(offerPool.block_number);
      }));

      if (!_.isEmpty(offerPoolsForSave)) {
        try {
          await context.db.OfferPool.insertMany(offerPoolsForSave, { ordered: false });
        } catch (e) {}
      }

      if (!_.isEmpty(block_number)) {
        await context.db.Versioning.updateOne({
          name: 'sync offerPools',
          network
        }, { number: block_number }, { upsert: true });
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
