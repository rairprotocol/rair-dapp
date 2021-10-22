const _ = require('lodash');
const log = require('../utils/logger')(module);
const moment = require('moment-timezone');

const { SYNC_CONTRACT_REPEAT_EVERY, SYNC_CONTRACT_TASK_INTERVAL } = process.env;

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync', { lockLifetime }, async (task, done) => {
    try {
      const networks = _.values(context.config.blockchain.networks);

      await Promise.all(_.map(networks, async (networkData, i) =>
        context.agenda.create('sync contracts', _.pick(networkData, ['network', 'name']))
          .repeatEvery(`${SYNC_CONTRACT_REPEAT_EVERY} minutes`)
          .schedule(moment()
            .utc()
            .add(Number(SYNC_CONTRACT_TASK_INTERVAL) * i, 'minutes')
            .toDate())
          .save()
      ));

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
