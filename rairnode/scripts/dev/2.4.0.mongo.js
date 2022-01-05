// blockchain value have to be updated for all existed contracts
db.Contract.find().toArray().forEach((item) => {
  switch (item.blockchain) {
    case 'BNB':
      db.Contract.findOneAndUpdate({ _id: item._id }, { $set: { blockchain: '0x61' } });
      break;
    case 'ETH':
      db.Contract.findOneAndUpdate({ _id: item._id }, { $set: { blockchain: '0x5' } });
      break;
    case 'tMATIC':
      db.Contract.findOneAndUpdate({ _id: item._id }, { $set: { blockchain: '0x13881' } });
      break;
    default:
      break;
  }
});

