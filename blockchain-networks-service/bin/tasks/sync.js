const _ = require('lodash');
const log = require('../utils/logger')(module);
const moment = require('moment-timezone');
const { AgendaTaskEnum } = require('../enums/agenda-task');

const { SYNC_CONTRACT_REPEAT_EVERY, SYNC_CONTRACT_TASK_INTERVAL } = process.env;

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define(AgendaTaskEnum.Sync, { lockLifetime }, async (task, done) => {
    try {
      await Promise.all(_.chain(context.config.blockchain.networks)
        .values()
        .filter(i => {
          if (process.env.PRODUCTION === 'true') return !i.testnet;
          return true;
        })
        .forEach((networkData, i) =>
          context.agenda.create(AgendaTaskEnum.SyncContracts, _.pick(networkData, ['network', 'name']))
            .repeatEvery(`${ SYNC_CONTRACT_REPEAT_EVERY } minutes`)
            .schedule(moment()
              .utc()
              .add(Number(SYNC_CONTRACT_TASK_INTERVAL) * i, 'minutes')
              .toDate())
            .save()
        )
        .value());

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
