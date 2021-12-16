const Agenda = require('agenda');
const moment = require('moment-timezone');
const log = require('../utils/logger')(module);
const { AgendaTaskEnum } = require('../enums/agenda-task');

module.exports = async (context) => {
  const db = context.mongo;

  // remove all old sync and sync-contracts tasks
  await context.db.Task.deleteMany({ name: { $in: ['sync', 'sync contracts'] } })

  // Start a new instance of agenda
  const agenda = new Agenda({
    defaultLockLifetime: 120000,
    lockLimit: 50,
    db: { processEvery: '1 seconds', collection: 'Task' },
    mongo: db
  });

  // Agenda listeners for starting, error and processing tasks
  agenda.on('ready', async () => {
    log.info('Agenda > Started');
    await agenda.start();

    // cleanup old tasks
    const removeJobs = await agenda.jobs({ name: 'system remove processed tasks' });

    if (removeJobs.length === 0) {
      await agenda.create('system remove processed tasks')
        .repeatEvery('1 days')
        .schedule(moment()
          .utc()
          .add(1, 'days')
          .startOf('day')
          .toDate())
        .save();
    }

    // start sync processes
    await agenda.create('sync')
      .schedule(moment()
        .utc()
        .add(5, 'minutes')
        .toDate())
      .save();
  });

  agenda.on('error', (err) => {
    log.info('Agenda > Error: ', err);
  });

  agenda.on('success', async task => {
    let data = task.attrs.data;
    let additionalInfo = '';

    switch (task.attrs.name) {
      case AgendaTaskEnum.SyncContracts:
        await agenda.create(AgendaTaskEnum.SyncProducts, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save();
        break;
      case AgendaTaskEnum.SyncProducts:
        await agenda.create(AgendaTaskEnum.SyncOfferPools, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save();
        break;
      case AgendaTaskEnum.SyncOfferPools:
        await agenda.create(AgendaTaskEnum.SyncOffers, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save();
        break;
      case AgendaTaskEnum.SyncOffers:
        await agenda.create(AgendaTaskEnum.SyncTokens, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save();
        break;
      case AgendaTaskEnum.SyncTokens:
        await agenda.create(AgendaTaskEnum.SyncLocks, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save();
        break;
      default:
        break;
    }

    log.info(`Agenda [${ task.attrs.name }][${ task.attrs._id }] > processed with data ${ JSON.stringify(data) }. ${ additionalInfo }`);
  });

  agenda.on('fail', (err) => {
    log.error(`Agenda > Fail: ${ JSON.stringify(err) }`);
  });


  // Application termination
  function graceful() {
    agenda.stop(() => {
      log.info('Agenda > Stopping...');
      process.exit(0);
    });
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);

  return agenda;
};
