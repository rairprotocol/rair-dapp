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