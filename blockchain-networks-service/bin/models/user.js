const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const { Schema } = mongoose;

const User = new Schema({
  email: { type: String, default: null },
  nickName: { type: String, unique: true },
  avatar: { type: String, default: null },
  firstName: { type: String, default: null, trim: true },
  lastName: { type: String, default: null, trim: true },
  publicAddress: { type: String, lowercase:true, required: true, unique: true },
  adminNFT: { type: String, lowercase:true, required: true, unique: true },
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

module.exports = User;
