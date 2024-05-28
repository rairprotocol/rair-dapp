// Update Products
db.Product.find().forEach((product) => {
  const collectionIndexInContract = product.collectionIndexInContract instanceof NumberInt || product.collectionIndexInContract instanceof NumberLong
    ? product.collectionIndexInContract + ""
    : product.collectionIndexInContract;
  const firstTokenIndex = product.firstTokenIndex instanceof NumberInt || product.firstTokenIndex instanceof NumberLong
    ? product.firstTokenIndex + ""
    : product.firstTokenIndex;

  db.Product.findOneAndUpdate({ _id: product._id }, { $set: { collectionIndexInContract, firstTokenIndex } });
});

// Update OfferPools
db.OfferPool.find().forEach((offerPool) => {
  const marketplaceCatalogIndex = offerPool.marketplaceCatalogIndex instanceof NumberInt || offerPool.marketplaceCatalogIndex instanceof NumberLong
    ? offerPool.marketplaceCatalogIndex + ""
    : offerPool.marketplaceCatalogIndex;
  const product = offerPool.product instanceof NumberInt || offerPool.product instanceof NumberLong
    ? offerPool.product + ""
    : offerPool.product;
  const rangeNumber = offerPool.rangeNumber instanceof NumberInt || offerPool.rangeNumber instanceof NumberLong
    ? offerPool.rangeNumber + ""
    : offerPool.rangeNumber;

  db.OfferPool.findOneAndUpdate({ _id: offerPool._id }, { $set: { marketplaceCatalogIndex, product, rangeNumber } });
});

// Update Offers
db.Offer.find().forEach((offer) => {
  const offerIndex = offer.offerIndex instanceof NumberInt || offer.offerIndex instanceof NumberLong
    ? offer.offerIndex + ""
    : offer.offerIndex;
  const product = offer.product instanceof NumberInt || offer.product instanceof NumberLong
    ? offer.product + ""
    : offer.product;
  const offerPool = offer.offerPool instanceof NumberInt || offer.offerPool instanceof NumberLong
    ? offer.offerPool + ""
    : offer.offerPool;
  const range = offer.range.map((item) => (item instanceof NumberInt || item instanceof NumberLong ? item + "" : item));
  const diamondRangeIndex = offer.diamondRangeIndex instanceof NumberInt || offer.diamondRangeIndex instanceof NumberLong
    ? offer.diamondRangeIndex + ""
    : offer.diamondRangeIndex;

  db.Offer.findOneAndUpdate({ _id: offer._id }, { $set: { offerIndex, product, offerPool, range, diamondRangeIndex } });
});

// Update MintedTokens
db.MintedToken.find().forEach((mintedToken) => {
  let write = false;
  const option = {};

  if (mintedToken.token && (mintedToken.token instanceof NumberInt || mintedToken.token instanceof NumberLong)) {
    option.token = mintedToken.token + "";
    write = true;
  }

  if (mintedToken.uniqueIndexInContract && (mintedToken.uniqueIndexInContract instanceof NumberInt || mintedToken.uniqueIndexInContract instanceof NumberLong)) {
    option.uniqueIndexInContract = mintedToken.uniqueIndexInContract + "";
    write = true;
  }

  if (mintedToken.offerPool && (mintedToken.offerPool instanceof NumberInt || mintedToken.offerPool instanceof NumberLong)) {
    option.offerPool = mintedToken.offerPool + "";
    write = true;
  }

  if (mintedToken.offer && (mintedToken.offer instanceof NumberInt || mintedToken.offer instanceof NumberLong)) {
    option.offer = mintedToken.offer + "";
    write = true;
  }

  if (write) {
    db.MintedToken.findOneAndUpdate({ _id: mintedToken._id }, { $set: option });
  }
});

// Update MetadataLinks
db.MetadataLink.find().forEach((metadataLink) => {
  const collectionIndex = metadataLink.collectionIndex instanceof NumberInt || metadataLink.collectionIndex instanceof NumberLong
    ? metadataLink.collectionIndex + ""
    : metadataLink.collectionIndex;
  const tokenIndex = metadataLink.tokenIndex instanceof NumberInt || metadataLink.tokenIndex instanceof NumberLong
    ? metadataLink.tokenIndex + ""
    : metadataLink.tokenIndex;

  db.MetadataLink.findOneAndUpdate({ _id: metadataLink._id }, { $set: { collectionIndex, tokenIndex } });
});

// Update LockedTokens
db.LockedTokens.find().forEach((lockedToken) => {
  const lockIndex = lockedToken.lockIndex instanceof NumberInt || lockedToken.lockIndex instanceof NumberLong
    ? lockedToken.lockIndex + ""
    : lockedToken.lockIndex;
  const product = lockedToken.product instanceof NumberInt || lockedToken.product instanceof NumberLong
    ? lockedToken.product + ""
    : lockedToken.product;
  const range = lockedToken.range.map((item) => (item instanceof NumberInt || item instanceof NumberLong ? item + "" : item));
  const lockedTokens = lockedToken.lockedTokens instanceof NumberInt || lockedToken.lockedTokens instanceof NumberLong
    ? lockedToken.lockedTokens + ""
    : lockedToken.lockedTokens;

  db.LockedTokens.findOneAndUpdate({ _id: lockedToken._id }, { $set: { lockIndex, product, range, lockedTokens } });
});

// Update Files
db.File.find().forEach((file) => {
  const product = file.product instanceof NumberInt || file.product instanceof NumberLong
    ? file.product + ""
    : file.product;
  const offer = file.offer.map((item) => (item instanceof NumberInt || item instanceof NumberLong ? item + "" : item));

  db.File.findOneAndUpdate({ _id: file._id }, { $set: { product, offer } });
});

