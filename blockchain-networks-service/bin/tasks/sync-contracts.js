const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { factoryAbi, erc721Abi } = require('../integrations/ethers/contracts');
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(AgendaTaskEnum.SyncContracts, { lockLifetime }, async (task, done) => {
    try {
      logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncContracts});
      const { network, name } = task.attrs.data;
      const contractsForSave = [];
      let block_number = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']
      const version = await context.db.Versioning.findOne({ name: 'sync contracts', network });
      const forbiddenContracts = await context.db.SyncRestriction.find({ blockchain: networkData.network, contract: false }).distinct('contractAddress');

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId, masterKey });

      await Moralis.Cloud.run(networkData.watchFunction, {
        address: networkData.factoryAddress,
        'sync_historical': true
      }, { useMasterKey: true });

      const {abi, topic} = getABIData(factoryAbi, 'event', 'NewContractDeployed');
      const options = {
        address: networkData.factoryAddress,
        chain: networkData.network,
        topic,
        abi,
        from_block: _.get(version, ['number'], 0)
      }

      let events = await Moralis.Web3API.native.getContractEvents(options);

      await Promise.all(_.map(events.result, async contract => {
        const nameAbi = getABIData(erc721Abi, 'function', 'name')
        const { token, owner, contractName } = contract.data

        // prevent storing contracts to DB and event listening for forbidden contracts from the list
        if (_.includes(forbiddenContracts, token.toLowerCase())) return;

        contractsForSave.push({
          user: owner,
          title: contractName,
          contractAddress: token,
          blockchain: networkData.network
        });

        block_number.push(Number(contract.block_number));

        // Listen to this contract's events
        await Moralis.Cloud.run(networkData.watchFunction, {
          address: token.toLowerCase(),
          'sync_historical': true
        }, { useMasterKey: true });
      }))

      if (!_.isEmpty(contractsForSave)) {
        try {
          await context.db.Contract.insertMany(contractsForSave, { ordered: false });
        } catch (e) {}
      }

      if (!_.isEmpty(block_number)) {
        await context.db.Versioning.updateOne({
          name: 'sync contracts',
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
