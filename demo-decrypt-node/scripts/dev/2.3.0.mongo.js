// Adding additional field "cover" for all products
db.Product.find().toArray().forEach((item) => {
  db.Product.findOneAndUpdate({ _id: item._id }, { $set: { cover: 'none' } });
});

