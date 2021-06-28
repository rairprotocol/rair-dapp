const Demo = require('./databaseModel.js')
require('./connectMongo.js');

const main = async () => {
	// Get all documents in the Demo collection
	const data = await Demo.find();

	console.log(data.length, 'documents in database')

	data.forEach((item, index) => {
		// Console log each item
		console.log(index,':',item);
	})
}

try {
	main()
} catch(err) {
	console.error(err);
}