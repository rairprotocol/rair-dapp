// Cleanup the OfferPoll collection
db.OfferPool.deleteMany({});

// Cleanup the  collection
db.Versioning.deleteMany({ name: 'sync offerPools' });

// Remove spaces in the start and end of the names
db.Contract.find().toArray().forEach(item => {
  db.Contract.updateOne({ _id: item._id }, { $set: { title: item.title.trim() } });
});

db.File.find().toArray().forEach(item => {
  db.File.updateOne({ _id: item._id }, { $set: { title: item.title.trim() } });
});

db.Offer.find().toArray().forEach(item => {
  db.Offer.updateOne({ _id: item._id }, { $set: { offerName: item.offerName.trim() } });
});

db.Product.find().toArray().forEach(item => {
  db.Product.updateOne({ _id: item._id }, { $set: { name: item.name.trim() } });
});
