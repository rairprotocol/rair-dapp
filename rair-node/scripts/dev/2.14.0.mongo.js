// Set user publicAddress to the files
db.File.find({}).forEach((file) => {
  const user = db.User.findOne({ adminNFT: file.author });
  db.File.findOneAndUpdate(
    { _id: file._id },
    { $set: { authorPublicAddress: user.publicAddress } },
  );
});
// Convert offer prices to string (originally number)
db.Offer.find({}).forEach((offer) => {
  db.Offer.findOneAndUpdate(
    { _id: offer._id },
    { $set: { price: offer.price + '' } },
  );
});
