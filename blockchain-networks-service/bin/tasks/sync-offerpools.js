const Moralis = require('moralis/node');
const _ = require('lodash');
const { getABIData } = require('../utils/helpers');
const { minterAbi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync offerPools', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const offerPoolsForSave = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(minterAbi, 'event', 'AddedOffer');
      const options = {
        address: networkData.minterAddress,
        chain: networkData.network,
        topic,
        abi
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

      return done();
    } catch (e) {
      return done(e);
    }
  });
};
