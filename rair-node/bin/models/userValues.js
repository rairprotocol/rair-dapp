const { Schema } = require('mongoose');

const UserValue = new Schema(
  {
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    namespace: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = UserValue;
