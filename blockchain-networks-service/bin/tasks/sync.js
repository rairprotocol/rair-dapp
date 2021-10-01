const _ = require('lodash');
const log = require('../utils/logger')(module);
const moment = require('moment-timezone');
const providers = require('../integrations/ethers/providers');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming

module.exports = (context) => {
  context.agenda.define('sync', { lockLifetime }, async (task, done) => {
    try {
      await Promise.all(_.map(providers, async (providerData, i) =>
        context.agenda.create('sync contracts', { network: providerData.symbol, providerData })
          .repeatEvery('30 minutes')
          .schedule(moment()
            .utc()
            .add(2 * i, 'minutes')
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
