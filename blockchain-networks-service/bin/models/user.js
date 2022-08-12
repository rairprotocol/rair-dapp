const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

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

User.pre('save', function signNickName(next) {
  if (!this.nickName) {
    this.nickName = this.publicAddress;
  }
  next();
});

User.pre('findOneAndUpdate', function updateNickName(next) {
  if (this.getUpdate().nickName) {
    this.getUpdate().nickName = `@${this.getUpdate().nickName}`;
  }
  next();
});
User.statics = {
  async textSearch(searchQuery, projection, limit, page) {
    return this.find(searchQuery, projection)
      .limit(limit)
      .skip(limit * (page - 1));
  },
  async search(
    textParam,
    projection = { _id: 1, avatar: 1, nickName: 1 },
    limit = 4,
    page = 1,
  ) {
    // eslint-disable-next-line no-param-reassign
    if (limit > 100) limit = 100;
    // eslint-disable-next-line no-param-reassign
    if (page < 0) page = 0;
    let searchQuery = {
      $text: {
        $search: `"${textParam}"`,
        $language: 'en',
        $caseSensitive: false,
      },
    };
    return this.textSearch(searchQuery, projection, limit, page).then(
      (data) => {
        if (!data.length || data.length === 0) {
          searchQuery = {
            nickName: { $regex: `.*${textParam}.*`, $options: 'i' },
          };
          return this.textSearch(searchQuery, projection, limit, page);
        }
        return data;
      },
    );
  },
};

module.exports = User;
