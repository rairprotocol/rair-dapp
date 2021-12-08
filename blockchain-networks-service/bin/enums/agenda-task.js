
// Creating enums without TS
// Nice example of this here:
// https://www.sohamkamani.com/javascript/enums/#enums-with-classes

class AgendaTaskEnum {
  // Create new instances of the same class as static attributes
  static SyncContracts = new AgendaTaskEnum("sync contracts")
  static SyncLocks = new AgendaTaskEnum("sync locks")
  static SyncOfferPools = new AgendaTaskEnum("sync offerPools")
  static SyncOffers = new AgendaTaskEnum("sync offers")
  static SyncProducts = new AgendaTaskEnum("sync products")
  static SyncTokens = new AgendaTaskEnum("sync tokens")
  static Sync = new AgendaTaskEnum("sync")

  constructor(val) {
    this.val = val
  }

  enumVal() {
    return this.val
  }
}

module.export.AgendaTaskEnum = AgendaTaskEnum;