require('dotenv').config();
const { MongoClient } = require('mongodb');


(async function () {
  console.log('Running Database Indexes');

  const client = await MongoClient.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db(client.s.options.dbName);

  await db.collection('User').createIndex(
    { publicAddress: 'text', nickName: 'text' },
    {
      weights: { publicAddress: 1, nickName: 3 },
      name: 'UserSearchIdx'
    }
  );

  await db.collection('Contract').createIndex({ user: 1 }, { background: true });
  await db.collection('Contract').createIndex({ contractAddress: 1, blockchain: 1 }, { background: true, unique: true });

  await db.collection('Product').createIndex({ name: 1 }, { background: true });
  await db.collection('Product').createIndex({ contract: 1 }, { background: true });
  await db.collection('Product').createIndex({ contract: 1, collectionIndexInContract: 1 }, { background: true, unique: true });
  await db.collection('Product').createIndex({ name: 'text'}, { weights: { name: 1 }, name: 'ProductSearchIdx' });

  await db.collection('OfferPool').createIndex({ contract: 1, product: 1 }, { background: true, unique: true });
  await db.collection('OfferPool').createIndex({ contract: 1, marketplaceCatalogIndex: 1 }, { background: true, unique: true });

  await db.collection('Offer').createIndex({ offerPool: 1 }, { background: true });
  await db.collection('Offer').createIndex({ offerPool: 1, offerIndex: 1 }, { background: true });
  await db.collection('Offer').createIndex({ contract: 1, offerPool: 1, offerIndex: 1 }, { background: true, unique: true });
  await db.collection('Offer').createIndex({ contract: 1, product: 1, offerIndex: 1 }, { background: true, unique: true });
  await db.collection('Offer').createIndex({ contract: 1, product: 1 }, { background: true});

  await db.collection('LockedTokens').createIndex({ contract: 1, product: 1 }, { background: true });

  await db.collection('File').createIndex({ author: 1 }, { background: true });
  await db.collection('File').createIndex({ title: 1 }, { background: true });
  await db.collection('File').createIndex({ creationDate: 1 }, { background: true });
  await db.collection('File').createIndex({ contract: 1, product: 1, offer: 1 }, { background: true });
  await db.collection('File').createIndex(
    { title: 'text', description: 'text' },
    {
      weights: { title: 1, description: 3 },
      name: 'FileSearchIdx'
    }
  );

  await db.collection('MintedToken').createIndex({ contract: 1, offerPool: 1, token: 1 }, { background: true, unique: true, name: 'MintedTokenUniqueIndex' });
  await db.collection('MintedToken').createIndex({ contract: 1, offerPool: 1 }, { background: true });

  await db.collection('LockedTokens').createIndex({ contract: 1, lockIndex: 1 }, { background: true, unique: true });

  await db.collection('Versioning').createIndex({ name: 1, network: 1 }, { background: true, unique: true });

  await db.collection('SyncRestriction').createIndex({ blockchain: 1, contractAddress: 1 }, { background: true, unique: true });

  console.log('Completed Database Indexes');

  process.exit(0);
}()).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
