// Removing redundant fields from Contract collection
db.Contract.updateMany({}, { $unset: { copies: 1, royalty: 1, license: 1, price: 1 } });

// Updating of all Files exist in DB by adding the new files and removing old one
db.File.updateMany({}, { $unset: { contractAddress: 1 }, $set: { productIndex: '2', offerIndex: '11' } });


