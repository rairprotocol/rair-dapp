// Move data from Contract collection to new collection TokenGroup
db.Contract.find().toArray().forEach((Contract) => {
  const tokenGroup = {
    tokenGroupAddress: Contract.contractAddress,
    title: Contract.title,
    creationDate: Contract.creationDate
  };

  if (Contract.contractAddress) {
    db.TokenGroup.insertOne(tokenGroup);
  }
});

// Remove unused Contract collection
db.Contract.drop();

// Updating of all Files exist in DB by adding the new files and removing old one
db.File.updateMany({}, { $unset: { contractAddress: 1 }, $set: { productAddress: 'tmp' } });


