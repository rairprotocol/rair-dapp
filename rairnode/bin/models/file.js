const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const File = new Schema(
  {
    // Video Data
    _id: { type: String, required: true },
    author: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    // Encryption data
    encryptionType: { type: String, required: true },
    key: { type: Object, required: true },
    mainManifest: { type: String, required: true },
    // Thumbnails
    staticThumbnail: { type: String, required: true },
    animatedThumbnail: { type: String, required: false },
    uri: { type: String, required: true },
    // Blockchain data
    contract: { type: Schema.ObjectId, required: true },
    product: { type: String, required: true },
    offer: { type: [String], required: true },
    // Extra data
    duration: { type: String, required: true },
    // Format data
    type: { type: String, required: true },
    extension: { type: String, required: true },
    category: { type: Schema.ObjectId, required: true },
    demo: { type: Boolean, default: false },

    creationDate: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

File.statics = {
  async searchPartial(filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');
    const reg = new RegExp(_.get(filter, 'query', ''), 'gi');

    return this.find(
      {
        $or: [{ title: reg }, { description: reg }],
        ...filters,
      },
      { key: 0 },
      { sort: { [sortBy]: direction } },
    );
  },

  async searchFull(filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');

    return this.find(
      {
        $text: { $search: _.get(filter, 'query', ''), $caseSensitive: false },
        ...filters,
      },
      { key: 0 },
      { sort: { [sortBy]: direction } },
    );
  },

  async search(filter, options = { sortBy: 'title', direction: 1 }) {
    return this.searchFull(filter, options).then((data) => {
      if (!data.length || data.length === 0) return this.searchPartial(filter, options);
      return data;
    });
  },
};

module.exports = File;
