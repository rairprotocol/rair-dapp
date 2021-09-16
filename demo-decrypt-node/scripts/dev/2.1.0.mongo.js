// Have to be run before rebuilding the server! Will remove the old version of the index
db.Offer.dropIndex({ offerPool: 1, rangeIndex: 1 });
db.Offer.dropIndex({ contract: 1, offerPool: 1, rangeIndex: 1 });
db.OfferPool.dropIndex('marketplaceCatalogIndex_1');

// Renaming fields in MintedToken collection
db.MintedToken.find().toArray().forEach((Token) => {
  const t = {};

  if (Token.range) {
    t.offer = Token.range
  }

  db.MintedToken.updateOne({ _id: Token._id }, { $unset: { range: 1 }, $set: t });
});

// Renaming fields in Offer collection
db.Offer.find().toArray().forEach((Offer) => {
  const set = {};

  if (Offer.rangeIndex) {
    set.offerIndex = Offer.rangeIndex;
  }

  if (Offer.rangeName) {
    set.offerName = Offer.rangeName;
  }

  db.Offer.updateOne({ _id: Offer._id }, { $unset: { rangeIndex: 1, rangeName: 1 }, $set: set });
});

// Changing type of field in MintedToken collection
db.MintedToken.find().toArray().forEach((item) => {
  const t = parseInt(item.token);
  db.MintedToken.findOneAndUpdate({ _id: item._id }, { $unset: { token: 1 } });
  db.MintedToken.findOneAndUpdate({ _id: item._id }, { $set: { token: t } });
});

