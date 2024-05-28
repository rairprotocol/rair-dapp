const mongoose = require('mongoose');

const { Schema } = mongoose;

const Category = new Schema({
  name: { type: String, required: true, unique: true },
}, { versionKey: false });

module.exports = Category;
