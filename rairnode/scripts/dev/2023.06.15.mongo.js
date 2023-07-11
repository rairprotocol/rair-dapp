db.File.find({}).forEach(async (file) => {
  // Identify all offers connected to the file
  const offerIdMapping = [];
  if (file.offer.length) {
    const foundOffers = await db.Offer.find({
      // product: file.product,
      contract: file.contract,
    });
    file.offer.forEach((offerNumber) => {
      let found;
      foundOffers.forEach((offer) => {
        if (offer.diamond) {
          if (offer.diamondRangeIndex.toString() === offerNumber.toString()) {
            found = offer;
          }
        } else if (offer.offerIndex.toString() === offerNumber.toString()) {
          found = offer;
        }
      });
      if (found) {
        offerIdMapping.push(found._id);
      }
    });
  }
  // Create an unlock entry with all the offer data
  if (offerIdMapping.length) {
    await db.Unlock.insertOne({
      file: file._id,
      offers: offerIdMapping,
    });
  }

  await db.File.findOneAndUpdate({ _id: file._id }, {
    // Set a single uploader field
    $set: {
      uploader: file.authorPublicAddress,
    },
    // Unset unneeded fields
    $unset: {
      authorPublicAddress: undefined,
      author: undefined,
      contract: undefined,
      product: undefined,
      offer: undefined,
      creationDate: undefined,
    },
  });
});
