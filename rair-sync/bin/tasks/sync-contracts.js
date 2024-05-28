const { AgendaTaskEnum } = require('../enums/agenda-task');
const { syncEventsFromSingleContract } = require('../utils/reusableTransactionHandler');

const lockLifetime = 1000 * 60 * 5;

/*
    Collection Name     Tasks used to sync
    ------------------------------------------------------------
    'Contract',         SyncContracts and SyncDiamondContracts
    'File',             No need to sync
    'User',             No need to sync
    'Product',          From ERC721 Contracts
    'OfferPool',        Sync from Minter Marketplace
    'Offer',            Sync from Minter Marketplace
    'MintedToken',      Sync from Minter Marketplace
    'LockedTokens',     From ERC721 Contracts
    'Versioning',       Updated on every tasks
    'Task',             Updated on every tasks
    'SyncRestriction',  No need to Sync
    'Transaction'       Updated on every task
*/

module.exports = (context) => {
  context.agenda.define(
    AgendaTaskEnum.SyncContracts,
    { lockLifetime },
    syncEventsFromSingleContract(AgendaTaskEnum.SyncContracts, 'factoryAddress'),
  );
  context.agenda.define(
    AgendaTaskEnum.SyncDiamondContracts,
    { lockLifetime },
    syncEventsFromSingleContract(AgendaTaskEnum.SyncDiamondContracts, 'diamondFactoryAddress'),
  );
  context.agenda.define(
    AgendaTaskEnum.SyncDiamondMarketplaceEvents,
    { lockLifetime },
    syncEventsFromSingleContract(AgendaTaskEnum.SyncDiamondMarketplaceEvents, 'diamondMarketplaceAddress'),
  );
  context.agenda.define(
    AgendaTaskEnum.SyncClassicMarketplaceEvents,
    { lockLifetime },
    syncEventsFromSingleContract(AgendaTaskEnum.SyncClassicMarketplaceEvents, 'minterAddress'),
  );
  context.agenda.define(
    'system remove processed tasks',
    { lockLifetime },
    async (task, done) => {
      try {
        await context.agenda.cancel({ nextRunAt: null });
        return done();
      } catch (e) {
        return done(e);
      }
    },
  );
};
