// Removes the LockedTokens schema in favor of the lockedCopies field in the Offers schema
db.LockedTokens.find({}).forEach(async (lock) => {
  const found = db.Offer.findOneAndUpdate({
    contract: lock.contract,
    product: lock.product,
    range: lock.range,
  }, {
    $set: {
      lockedCopies: lock.lockedTokens,
    },
  });
  if (found && found._id) {
    await db.LockedTokens.deleteOne({ _id: lock._id });
  }
});
