const mongoose = require('mongoose');

const startMongo = async () => {
	console.log('Connecting to Mongo DB')
	let mongoDBInstance = await mongoose.connect('mongodb://127.0.0.1/rairTestDemo', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});
	console.log('Mongo DB is ready!');

	return mongoDBInstance;
}

module.exports = startMongo();