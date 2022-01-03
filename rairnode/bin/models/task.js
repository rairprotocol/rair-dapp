const mongoose = require('mongoose');

const { Schema } = mongoose;

const Task = new Schema({
  name: { type: String, required: true },
  nextRunAt: { type: Date, required: true },
  data: { type: Object, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Task;
