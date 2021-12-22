// Updating File information
db.File.find().forEach((item) => {
	if (item.type === undefined && item.extension === undefined) {
		db.File.updateOne({
			_id: item._id
		}, {
		$set: {
				staticThumbnail: `/thumbnails/${item.thumbnail}.png`,
				animatedThumbnail: `/thumbnails/${item.thumbnail}.gif`,
				duration: 'Unknown!',
				type: 'video',
				extension: 'mp4'
			}
		});
	}
});

// Cleaning unused fields in File collection
db.File.updateMany({},{
	$unset: {
		currentOwner: "",
		thumbnail: ""
	}
});

// drop old db index
db.OfferPool.dropIndex({ contract: 1, product: 1 });

// Update all existed Users
db.User.find().toArray().forEach(user => {
  db.User.findOneAndUpdate({ _id: user._id }, { $set: { nickName: user.publicAddress, avatar: null } })
});

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

// add new field to the Products
db.Product.updateMany({}, { $set: { category: null } });

// add new field to the Files
db.File.updateMany({}, { $set: { category: null } });

// add new field to Files
db.File.updateMany({}, { $set: { demo: false } });
