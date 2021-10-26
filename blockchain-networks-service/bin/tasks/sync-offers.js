const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { minterAbi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync offers', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const offersForSave = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(minterAbi, 'event', 'AppendedRange');
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
          offerIndex,
          rangeIndex,
          startToken,
          endToken,
          price,
          name
        } = offerPool.data;

        offersForSave.push({
          offerIndex: rangeIndex,
          contract: contractAddress,
          product: productIndex,
          offerPool: offerIndex,
          price,
          range: [startToken, endToken],
          offerName: name
        });
      });

      if (!_.isEmpty(offersForSave)) {
        try {
          await context.db.Offer.insertMany(offersForSave, { ordered: false });
        } catch (e) {}
      }

      // TODO: Have to be updated the number of offers per offerPooll

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
