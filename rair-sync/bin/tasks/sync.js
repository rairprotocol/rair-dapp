const moment = require('moment-timezone');
const { blockchain } = require('../config');
const log = require('../utils/logger')(module);
const { AgendaTaskEnum } = require('../enums/agenda-task');

const { SYNC_CONTRACT_REPEAT_EVERY, SYNC_CONTRACT_TASK_INTERVAL } = process.env;

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(
    AgendaTaskEnum.Sync,
    { lockLifetime },
    async (task, done) => {
      try {
        const chainsToProcess = Object.keys(blockchain.networks)
          .filter((chain) => {
            if (process.env.PRODUCTION === 'true') {
              return !chain.testnet;
            }
            return true;
          });
        let startupTime = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const chain of chainsToProcess) {
          const { network, name } = blockchain.networks[chain];
          console.info(AgendaTaskEnum.SyncContracts, { network, name });
          await context.agenda.create(
            AgendaTaskEnum.SyncContracts,
            { network, name },
          )
            .repeatEvery(`${SYNC_CONTRACT_REPEAT_EVERY} minutes`)
            .schedule(moment()
              .utc()
              .add(Number(SYNC_CONTRACT_TASK_INTERVAL) * startupTime, 'minutes')
              .toDate())
            .save();
          log.info(`[${network}] Task '${AgendaTaskEnum.SyncContracts}' scheduled to start in ${startupTime} minutes`);
          startupTime += 1;
        }
        return done();
      } catch (e) {
        log.error(e);
        return done(e);
      }
    },
  );
};
