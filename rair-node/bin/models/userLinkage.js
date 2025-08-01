const { Schema } = require('mongoose');

const UserLinkage = new Schema(
  {
    accounts: [{ type: Schema.ObjectId, ref: 'User', required: true }],
  },
);

module.exports = UserLinkage;
