// Have to be run before rebuilding the server! Will remove the old version of the index
db.File.dropIndex('FileSearchIdx');

// Removing redundant fields from Contract collection
db.Contract.updateMany({}, { $unset: { copies: 1, royalty: 1, license: 1, price: 1 } });

// Updating of all Files exist in DB by adding the new fields and removing old one
db.File.find().toArray().forEach((File) => {
  const data = {
    contract: File.contractAddress,
    product: 2,
    offer: [11]
  };

  db.File.updateOne({ _id: File._id }, { $unset: { contractAddress: 1 }, $set: data });
});


