const mongoose = require('mongoose');
const log = require('./utils/logger')(module);
const {
  getMongoConnectionStringURI
} = require('./shared_backend_code_generated/mongo/mongoUtils');
const {
  appSecretManager
} = require('./vault');

class MongoConnectionManager {
  constructor() {
    this.mongooseConnection = null;
  }

  async getMongooseConnection({
    connectionString
  }) {
    if(this.mongooseConnection === null) {
      const mongoConnectionString = await getMongoConnectionStringURI({appSecretManager});
      await this.connectToMongoose({
        connectionString: mongoConnectionString
      });
    }
    return this.mongooseConnection;
  }

  async connectToMongoose({
    connectionString
  }) {
    const mongooseConnection = await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((c) => {
      if (process.env.PRODUCTION === 'true') {
        log.info('DB Connected!');
      } else {
        log.info('Development DB Connected!');
      }
      return c;
    })
    .catch((e) => {
      log.error('DB Not Connected!');
      log.error(`Reason: ${e.message}`);
    });
    this.mongooseConnection = mongooseConnection;
  }
}

const mongoConnectionManager = new MongoConnectionManager();

module.exports = {
  mongoConnectionManager
}