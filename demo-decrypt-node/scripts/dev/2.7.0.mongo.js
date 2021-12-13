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

// add new field to the Products
db.Product.updateMany({}, { $set: { category: null } });

// add new field to the Files
db.File.updateMany({}, { $set: { category: null } });
