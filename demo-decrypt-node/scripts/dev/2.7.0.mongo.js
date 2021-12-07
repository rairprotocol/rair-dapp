// Update all existed Users
db.User.find().toArray().forEach(user => {
  db.User.findOneAndUpdate({ _id: user._id }, { $set: { nickName: user.publicAddress, avatar: null } })
});
