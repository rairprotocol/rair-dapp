db.MintedToken.find({}).forEach(async (token) => {
  const foundContract = await db.Contract.findOne({ _id: token.contract });
  if (foundContract) {
      if (foundContract.diamond) {
      const offerD = await db.Offer.findOne({
        contract: token.contract,
        diamondRangeIndex: token.offer });
      const field = {};

       if (!token.product && offerD) {
        field.product = offerD.product;
      }

      await db.MintedToken.findOneAndUpdate({ _id: token._id }, { $set: field });
  } else {
      const offerC = await db.Offer.findOne({
          contract: token.contract,
          offerIndex: token.offer });
      const field = {};

      if (!token.product && offerC) {
        field.product = offerC.product;
      }

     await db.MintedToken.findOneAndUpdate({ _id: token._id }, { $set: field });
      }
  }
});
