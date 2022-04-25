const Agenda = require('agenda');
const moment = require('moment-timezone');
const log = require('../utils/logger')(module);
const { AgendaTaskEnum } = require('../enums/agenda-task');

module.exports = async (context) => {
  const db = context.mongo;

  // remove all old sync and sync-contracts tasks
  await context.db.Task.deleteMany({ name: { $in: ['sync', 'sync contracts'] } })
  // Mark all sync task as Not Running
  await context.db.Versioning.updateMany({}, {$set: {running: false}});

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
        .add(1, 'minutes')
        .toDate())
      .save();
      log.info('Sync tasks will start in a minute!');
  });

  agenda.on('error', (err) => {
    log.info('Agenda > Error: ', err);
  });

  agenda.on('success', async task => {
    let data = task.attrs.data;
    let additionalInfo = '';

    console.log(`Finished task: ${task.attrs.name}!`, data);
    switch (task.attrs.name) {
      case AgendaTaskEnum.SyncContracts:
        await agenda.create(AgendaTaskEnum.SyncDiamondContracts, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save()
        break;
      case AgendaTaskEnum.SyncDiamondContracts:
        await agenda.create(AgendaTaskEnum.SyncAll721Events, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save()
        break;
      case AgendaTaskEnum.SyncAll721Events:
        await agenda.create(AgendaTaskEnum.SyncClassicMarketplaceEvents, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save()
        break;
      case AgendaTaskEnum.SyncClassicMarketplaceEvents:
        await agenda.create(AgendaTaskEnum.SyncAllDiamond721Events, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save()
        break;
      case AgendaTaskEnum.SyncAllDiamond721Events:
        await agenda.create(AgendaTaskEnum.SyncDiamondMarketplaceEvents, data)
          .schedule(moment()
            .utc()
            .toDate())
          .save()
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
