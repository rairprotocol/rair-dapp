// UNUSED TASK
const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { minterAbi } = require('../integrations/ethers/contracts');
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(AgendaTaskEnum.SyncOffers, { lockLifetime }, async (task, done) => {
    try {
      return done();
      logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncOffers});
      const { network, name } = task.attrs.data;
      const offersForSave = [];
      const offerPoolsForUpdate = [];
      let block_number = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(minterAbi, 'event', 'AppendedRange');
      const version = await context.db.Versioning.findOne({ name: 'sync offers', network });
      let forbiddenContracts = await context.db.SyncRestriction.find({ blockchain: networkData.network, offers: false }).distinct('contractAddress');
      forbiddenContracts = _.map(forbiddenContracts, c => c.toLowerCase());

      const options = {
        address: networkData.minterAddress,
        chain: networkData.network,
        topic,
        abi,
        from_block: _.get(version, ['number'], 0)
      };

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId, masterKey });

      const events = await Moralis.Web3API.native.getContractEvents(options);

      await Promise.all(_.map(events.result, async offer => {
        const {
          contractAddress,
          productIndex,
          offerIndex,
          rangeIndex,
          startToken,
          endToken,
          price,
          name
        } = offer.data;

        // prevent storing offers to DB for forbidden contracts
        if (_.includes(forbiddenContracts, contractAddress.toLowerCase())) return;

        const contract = await context.db.Contract.findOne({ contractAddress: contractAddress.toLowerCase(), blockchain: network }, { _id: 1 });

        if (!contract) return;

        const marketplaceCatalogIndex = Number(offerIndex);
        const offerPoolIndex = _.findIndex(offerPoolsForUpdate, o => o.contract.equals(contract._id) && o.marketplaceCatalogIndex === marketplaceCatalogIndex);

        if (offerPoolIndex < 0) {
          offerPoolsForUpdate.push({
            contract: contract._id,
            marketplaceCatalogIndex,
            rangeNumber: 1
          });
        } else {
          ++offerPoolsForUpdate[offerPoolIndex].rangeNumber;
        }

        offersForSave.push({
          offerIndex: rangeIndex,
          contract: contract._id,
          product: productIndex,
          offerPool: offerIndex,
          price,
          range: [startToken, endToken],
          offerName: name
        });

        block_number.push(Number(offer.block_number));
      }));

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

      if (!_.isEmpty(block_number)) {
        await context.db.Versioning.updateOne({
          name: 'sync offers',
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
