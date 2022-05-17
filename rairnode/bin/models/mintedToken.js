const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Metadata = new Schema(
  {
    name: { type: String, required: true, default: 'none' },
    description: { type: String, required: true, default: 'none' },
    artist: { type: String, default: 'none' },
    external_url: { type: String, default: 'none' },
    image: { type: String },
    animation_url: { type: String },
    attributes: {
      type: [
        {
          trait_type: String,
          value: String,
        },
      ],
    },
  },
  { _id: false }
);

const MintedToken = new Schema(
  {
    token: { type: String, required: true },
    uniqueIndexInContract: { type: String, required: true },
    ownerAddress: { type: String, lowercase: true },
    offerPool: { type: String },
    offer: { type: String, required: true },
    contract: { type: Schema.ObjectId, required: true },
    metadata: { type: Metadata, default: () => ({}) },
    metadataURI: { type: String, default: 'none' },
    authenticityLink: { type: String, default: 'none' },
    isMinted: { type: Boolean, required: true },
    isMetadataPinned: { type: Boolean },
    creationDate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

MintedToken.pre('save', function (next) {
  const token = this;
  const reg = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  );

  if (token.isNew) {
    token.isMetadataPinned = reg.test(token.metadataURI || '');
  } else if (token.metadata) {
    model('MintedToken', MintedToken, 'MintedToken').findOne(
      {
        contract: token.contract,
        offerPool: token.offerPool,
        token: token.token,
      },
      (err, result) => {
        if (err) {
          next(err);
        } else {
          token.isMetadataPinned =
            reg.test(token.metadataURI || '') &&
            token.metadataURI !== result.metadataURI;
        }
      }
    );
  }

  next();
});

MintedToken.pre(
  ['update', 'updateOne', 'findOneAndUpdate'],
  async function (next) {
    try {
      const reg = new RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      );
      const docToUpdate = await this.model.findOne(this.getQuery());
      const newFields = this.getUpdate();

      for (const key in newFields) {
        if (key.includes('metadata')) {
          this.getUpdate().isMetadataPinned =
            reg.test(newFields.metadataURI || '') &&
            newFields.metadataURI !== docToUpdate.metadataURI;
          break;
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }
);

MintedToken.pre('insertMany', async (next, tokens) => {
  const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);

  if (Array.isArray(tokens) && tokens.length) {
    tokens.map((token) => {
      token.isMetadataPinned = reg.test(token.metadataURI || '');
      return token;
    });
  }

  next();
});

module.exports = MintedToken;
