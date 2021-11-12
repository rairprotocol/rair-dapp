// Cleanup the OfferPoll collection
db.OfferPool.deleteMany({});

// Cleanup the  collection
db.Versioning.deleteMany({ name: 'sync offerPools' });

