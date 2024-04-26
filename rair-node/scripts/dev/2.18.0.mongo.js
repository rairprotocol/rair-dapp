// Update contracts
db.Contract.find().forEach((contract) => {
  const fields = {};
  if (!contract.blockSync) {
    fields.blockSync = false;
  }
  if (!contract.blockView) {
    fields.blockView = false;
  }
  db.Contract.findOneAndUpdate({ _id: contract._id }, { $set: fields });
});
