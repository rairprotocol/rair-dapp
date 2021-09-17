// Import the Schema and model from Mongoose
const { Schema, model } = require('mongoose');
// Define what an Object ID is from the Schema definition
const ObjectId = Schema.ObjectId;

const categoriesAllowed = ['Books', 'Audio', 'Video', 'CAD', 'Code', 'Games'];

// Define a new Schema with the information to store
const DemoSchema = new Schema({
	tokenAddress: {type: String},
	name: {type: String},
	symbol: {type: String},
	granularity: {type: Number},
	decimals: {type: Number},
	balanceOfFactory: {type: Number}
}, {timestamps: true});

module.exports = model('Demo', DemoSchema);