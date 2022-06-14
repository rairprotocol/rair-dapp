// Set user publicAddress to the files
db.File.find({}).forEach((file) => {
  const user = db.User.findOne({ adminNFT: file.author });
  db.File.findOneAndUpdate({ _id: file._id }, { $set: { authorPublicAddress: user.publicAddress } });
});
