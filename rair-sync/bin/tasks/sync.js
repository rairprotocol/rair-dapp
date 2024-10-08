const moment = require('moment-timezone');

const { Blockchain } = require('../models');

const log = require('../utils/logger')(module);
const { AgendaTaskEnum } = require('../enums/agenda-task');

const { SYNC_CONTRACT_TASK_INTERVAL } = process.env;

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(
    AgendaTaskEnum.Sync,
    { lockLifetime },
    async (task, done) => {
      try {
        const chainsToProcess = Blockchain.find({ sync: true }).lean();
        let startupTime = 0;
        // eslint-disable-next-line no-restricted-syntax
        for await (const chain of chainsToProcess) {
          const { hash, name } = chain;
          const scheduledTime = moment()
            .utc()
            .add(Number(SYNC_CONTRACT_TASK_INTERVAL) * startupTime, 'minutes')
            .toDate();
          await context.agenda.create(
            AgendaTaskEnum.SyncContracts,
            { hash, name },
          )
            .schedule(scheduledTime)
            .save();
          log.info(`[${hash}] '${AgendaTaskEnum.SyncContracts}' will start in ${Number(SYNC_CONTRACT_TASK_INTERVAL) * startupTime} minutes`);
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
