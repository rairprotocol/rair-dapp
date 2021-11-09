// set contract id instead of contractAddress
db.Contract.find().toArray().forEach((contract) => {
  db.Product.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
});

// drop old contract index
db.Contract.dropIndexes('contractAddress_1');

