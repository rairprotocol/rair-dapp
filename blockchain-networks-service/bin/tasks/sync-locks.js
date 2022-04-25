const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { erc721Abi } = require('../integrations/ethers/contracts');
const { logAgendaActionStart } = require('../utils/agenda_action_logger');
const { AgendaTaskEnum } = require('../enums/agenda-task');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(AgendaTaskEnum.SyncLocks, { lockLifetime }, async (task, done) => {
    return done();
    try {
      logAgendaActionStart({agendaDefinition: AgendaTaskEnum.SyncLocks});
      const { network, name } = task.attrs.data;
      const locksForSave = [];
      const locksForUpdate = [];
      let block_number_locked = [];
      let block_number_unlocked = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId, masterKey } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const locked = getABIData(erc721Abi, 'event', 'RangeLocked');
      const unlocked = getABIData(erc721Abi, 'event', 'RangeUnlocked');
      const versionLocked = await context.db.Versioning.findOne({ name: 'sync locks locked', network });
      const versionUnlocked = await context.db.Versioning.findOne({ name: 'sync locks unlocked', network });
      let forbiddenContracts = await context.db.SyncRestriction.find({ blockchain: networkData.network, locks: false }).distinct('contractAddress');
      forbiddenContracts = _.map(forbiddenContracts, c => c.toLowerCase());

      const generalOptionsForLocked = {
        chain: networkData.network,
        from_block: _.get(versionLocked, ['number'], 0),
        ...locked
      };
      const generalOptionsForUnlocked = {
        chain: networkData.network,
        from_block: _.get(versionUnlocked, ['number'], 0),
        ...unlocked
      };

      // getting only contracts for which not forbidden locks sync
      const arrayOfContracts = await context.db.Contract.find({ blockchain: network, contractAddress: { $nin: forbiddenContracts } }, { _id: 1, contractAddress: 1 });

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId, masterKey });

      await Promise.all(_.map(arrayOfContracts, async item => {
        const { _id, contractAddress: contract } = item;
        const optionsLocked = {
          address: contract,
          ...generalOptionsForLocked
        };

        const optionsUnlocked = {
          address: contract,
          ...generalOptionsForUnlocked
        };
        const eventsLocked = await Moralis.Web3API.native.getContractEvents(optionsLocked);
        const eventsUnlocked = await Moralis.Web3API.native.getContractEvents(optionsUnlocked);

        if (!_.isEmpty(eventsLocked.result)) {
          _.forEach(eventsLocked.result, lock => {
              const {
                lockIndex,
                productIndex,
                startingToken,
                endingToken,
                tokensLocked,
                productName
              } = lock.data;

              locksForSave.push({
                lockIndex: lockIndex ? lockIndex : lock.block_number, //FIXME: using block_number as lockIndex for test networks, since old version of factory don't have the lockIndex
                contract: _id,
                product: productIndex,
                range: [startingToken, endingToken],
                lockedTokens: tokensLocked,
                isLocked: true
              });

            block_number_locked.push(Number(lock.block_number));
            });
        }

        if (!_.isEmpty(eventsUnlocked.result)) {
          _.forEach(eventsUnlocked.result, lock => {
              const { lockIndex, productID, startingToken, endingToken } = lock.data;

              locksForUpdate.push({
                updateOne: {
                  filter: { contract: _id, lockIndex: lockIndex || lock.block_number }, //FIXME: using block_number as lockIndex for test networks, since old version of factory don't have the lockIndex
                  update: {
                    product: productID,
                    range: [startingToken, endingToken],
                    isLocked: false,
                    lockedTokens: 0
                  },
                  upsert: true,
                  setDefaultsOnInsert: true
                }
              });

            block_number_unlocked.push(Number(lock.block_number));
            });
        }
      }));

      if (!_.isEmpty(locksForSave)) {
        try {
          await context.db.LockedTokens.insertMany(locksForSave, { ordered: false });
        } catch (e) {
        }
      }

      if (!_.isEmpty(locksForUpdate)) {
        try {
          await context.db.LockedTokens.bulkWrite(locksForUpdate, { ordered: false });
        } catch (e) {
        }
      }

      if (!_.isEmpty(block_number_locked)) {
        await context.db.Versioning.updateOne({
          name: 'sync locks locked',
          network
        }, { number: _.chain(block_number_locked).sortBy().last().value() }, { upsert: true });
      }

      if (!_.isEmpty(block_number_unlocked)) {
        await context.db.Versioning.updateOne({
          name: 'sync locks unlocked',
          network
        }, { number: _.chain(block_number_unlocked).sortBy().last().value() }, { upsert: true });
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
