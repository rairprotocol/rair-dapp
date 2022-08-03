const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const _ = require('lodash');

const { Schema } = mongoose;

const User = new Schema({
  email: { type: String, default: null },
  nickName: { type: String, unique: true },
  avatar: { type: String, default: null },
  background: { type: String, default: null },
  firstName: { type: String, default: null, trim: true },
  lastName: { type: String, default: null, trim: true },
  publicAddress: { type: String, lowercase:true, required: true, unique: true },
  nonce: { type: String, default: () => nanoid() },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

User.pre('save', function (next) {
  if (!this.nickName) {
    this.nickName = this.publicAddress;
  }
  next();
});

User.pre('findOneAndUpdate', function (next) {
  if (this.getUpdate().nickName) {
    this.getUpdate().nickName = `@${this.getUpdate().nickName}`;
  }
  next();
});

User.statics = {
  searchPartial: async function (filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');
    const reg = new RegExp(_.get(filter, 'query', ''), "gi");

    return this.find({
      $or: [
        { publicAddress: reg },
        { nickName: reg },
      ],
      ...filters,
    }, { adminNFT: 0, nonce: 0 }, { sort: { [sortBy]: direction } });
  },

  searchFull: async function (filter, { sortBy, direction }) {
    const filters = _.omit(filter, 'query');

    return this.find({
      $text: { $search: _.get(filter, 'query', ''), $caseSensitive: false },
      ...filters,
    }, { adminNFT: 0, nonce: 0 }, { sort: { [sortBy]: direction } });
  },

  search: async function (filter, options = { sortBy: 'nickName', direction: 1 }) {
    return this.searchFull(filter, options)
      .then((data) => {
        if (!data.length || data.length === 0) return this.searchPartial(filter, options);
        return data;
      });
  },
};

module.exports = User;
