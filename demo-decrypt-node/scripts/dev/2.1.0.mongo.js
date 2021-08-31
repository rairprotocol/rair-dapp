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


