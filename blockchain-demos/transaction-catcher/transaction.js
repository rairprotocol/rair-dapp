const { Schema } = require('mongoose');

const Transaction = new Schema({
  transactionHash: { type: String, unique: true },
  user: { type: String, lowercase:true, required: true },
  blockchain: { type: String, required: true },
  queriedLogs: [ {type: Number, required: true} ]
}, { versionKey: false, timestamps: true });

module.exports = Transaction;
