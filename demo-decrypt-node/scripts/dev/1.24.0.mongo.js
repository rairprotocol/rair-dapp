// for removing 'redundant' fields from all existed contracts
db.Contract.updateMany({}, { $unset: { copies: 1, royalty: 1, license: 1, price: 1 } });

