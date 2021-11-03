const Moralis = require('moralis/node');
const _ = require('lodash');
const { getABIData } = require('../utils/helpers');
const { minterAbi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync offers', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const offersForSave = [];
      const offerPoolsForUpdate = [];
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
        const contract = contractAddress.toLowerCase();
        const marketplaceCatalogIndex = Number(offerIndex);
        const offerPoolIndex = _.findIndex(offerPoolsForUpdate, o => o.contract === contract && o.marketplaceCatalogIndex === marketplaceCatalogIndex);

        if (offerPoolIndex < 0) {
          offerPoolsForUpdate.push({
            contract,
            marketplaceCatalogIndex,
            rangeNumber: 1
          });
        } else {
          ++offerPoolsForUpdate[offerPoolIndex].rangeNumber;
        }

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

      if (!_.isEmpty(offerPoolsForUpdate)) {
        try {
          const resultOfferPools = _.map(offerPoolsForUpdate, of => ({
            updateOne: {
              filter: { contract: of.contract, marketplaceCatalogIndex: of.marketplaceCatalogIndex },
              update: {
                rangeNumber: of.rangeNumber
              }
            }
          }));

          await context.db.OfferPool.bulkWrite(resultOfferPools, { ordered: false });
        } catch (e) {}
      }

      return done();
    } catch (e) {
      return done(e);
    }
  });
};
