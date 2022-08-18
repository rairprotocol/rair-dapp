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
  context.agenda.define(AgendaTaskEnum.SyncOfferPools, { lockLifetime }, async (task, done) => {
    try {
      return done();
      logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncOfferPools});
      const { network, name } = task.attrs.data;
      const offerPoolsForSave = [];
      let block_number = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(minterAbi, 'event', 'AddedOffer');
      const version = await context.db.Versioning.findOne({ name: 'sync offerPools', network });
      let forbiddenContracts = await context.db.SyncRestriction.find({ blockchain: networkData.network, offerPools: false }).distinct('contractAddress');
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

      await Promise.all(_.map(events.result, async offerPool => {
        const {
          contractAddress,
          productIndex,
          rangesCreated,
          catalogIndex
        } = offerPool.data;

        // prevent storing offerPools to DB for forbidden contracts
        if (_.includes(forbiddenContracts, contractAddress.toLowerCase())) return;

        const contract = await context.db.Contract.findOne({ contractAddress: contractAddress.toLowerCase(), blockchain: network }, { _id: 1 });

        if (!contract) return;

        offerPoolsForSave.push({
          marketplaceCatalogIndex: catalogIndex,
          contract: contract._id,
          product: productIndex,
          rangeNumber: rangesCreated,
          minterAddress: networkData.minterAddress,
        });

        block_number.push(Number(offerPool.block_number));
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
        }, { number: _.chain(block_number).sortBy().last().value() }, { upsert: true });
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
