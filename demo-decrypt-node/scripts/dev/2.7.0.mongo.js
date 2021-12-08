// drop ald db index
db.OfferPool.dropIndex({ contract: 1, product: 1 });

// Update all existed Users
db.User.find().toArray().forEach(user => {
  db.User.findOneAndUpdate({ _id: user._id }, { $set: { nickName: user.publicAddress, avatar: null } })
});
