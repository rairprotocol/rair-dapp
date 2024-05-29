// Update contracts
db.Contract.find().forEach((contract) => {
  db.Contract.findOneAndUpdate({ _id: contract._id }, { $set: { singleMetadata: false, metadataURI: 'none' } });
});

// Update products
db.Product.find().forEach((product) => {
  db.Product.findOneAndUpdate({ _id: product._id }, { $set: { singleMetadata: false, metadataURI: 'none' } });
});
