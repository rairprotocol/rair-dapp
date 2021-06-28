require('dotenv').config();
const { MongoClient } = require('mongodb');


(async function () {
  console.log('Running Database Indexes');

  const client = await MongoClient.connect(process.env.PRODUCTION === 'true' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(client.s.options.dbName);

  await db.collection('File').createIndex(
    { title: 'text', description: 'text' },
    {
      weights: { searchData: 1, description: 3 },
      name: 'FileSearchIdx'
    }
  );

  console.log('Completed Database Indexes');

  process.exit(0);
}()).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
