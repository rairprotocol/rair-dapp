const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Metadata = new Schema(
  {
    image: {
      type: String,
      required: true,
      default: process.env.DEFAULT_PRODUCT_COVER,
    },
    image_data: { type: String, required: false },
    artist: { type: String, default: 'none' },
    external_url: { type: String, default: 'none' },
    description: { type: String, required: true, default: 'none' },
    name: { type: String, required: true, default: 'none' },
    attributes: {
      type: [
        {
          display_type: { type: String, required: false },
          trait_type: { type: String, required: false },
          value: { type: String, required: true },
        },
      ],
      required: false,
    },
    background_color: { type: String, required: false },
    animation_url: { type: String, required: false },
    youtube_url: { type: String, required: false },
  },
  { _id: false },
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
    isURIStoredToBlockchain: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
  },
  { versionKey: false },
);
MintedToken.statics = {
  async textSearch(searchQuery, projection, limit, page) {
    return this.find(searchQuery, projection)
      .limit(limit)
      .skip(limit * (page - 1));
  },
  async search(
    textParam,
    projection = {
      _id: 1,
      contract: 1,
      uniqueIndexInContract: 1,
      'metadata.name': 1,
      'metadata.description': 1,
      'metadata.animation_url': 1,
      'metadata.image': 1,
      'metadata.artist': 1,
    },
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
            $or: [
              {
                'metadata.name': { $regex: `.*${textParam}.*`, $options: 'i' },
              },
              {
                'metadata.description': {
                  $regex: `.*${textParam}.*`,
                  $options: 'i',
                },
              },
            ],
          };
          return this.textSearch(searchQuery, projection, limit, page);
        }
        return data;
      },
    );
  },
};
MintedToken.pre('save', (next) => {
  const token = this;
  const reg = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
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
      },
    );
  }

  next();
});

MintedToken.pre(
  ['update', 'updateOne', 'findOneAndUpdate'],
  async function (next) {
    try {
      const reg = new RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
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
  },
);

MintedToken.pre('insertMany', async (next, tokens) => {
  const reg = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
  );

  if (Array.isArray(tokens) && tokens.length) {
    tokens.map((token) => {
      token.isMetadataPinned = reg.test(token.metadataURI || '');
      return token;
    });
  }

  next();
});

module.exports = MintedToken;
