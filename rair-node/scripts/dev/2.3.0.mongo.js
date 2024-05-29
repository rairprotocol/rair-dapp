// Adding additional field "cover" for all products
db.Product.find().toArray().forEach((item) => {
  if (!item.cover || item.cover ==='none')
    db.Product.findOneAndUpdate({ _id: item._id }, { $set: { cover: 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW' } });
});

