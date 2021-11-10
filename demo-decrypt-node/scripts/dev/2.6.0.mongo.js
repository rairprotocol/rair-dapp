// drop old contract index
db.Contract.dropIndexes('contractAddress_1');

// set contract id instead of contractAddress
db.Contract.find().toArray().forEach((contract) => {
  db.Product.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
  db.OfferPool.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
  db.Offer.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
  db.MintedToken.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
  db.LockedTokens.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
  db.File.updateMany({ contract: contract.contractAddress }, { $set: { contract: contract._id } });
});

// cleanup the collections from the not existing contract artefacts (run one by one)
db.Product.deleteMany({ contract: { $regex: /^0x\w{40}$/ } });
db.OfferPool.deleteMany({ contract: { $regex: /^0x\w{40}$/ } });
db.Offer.deleteMany({ contract: { $regex: /^0x\w{40}$/ } });
db.MintedToken.deleteMany({ contract: { $regex: /^0x\w{40}$/ } });
db.LockedTokens.deleteMany({ contract: { $regex: /^0x\w{40}$/ } });
