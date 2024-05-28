const { ObjectId } = require('mongodb');
const { MintedToken, Offer, TokenMetadata } = require('../models');

/*
{
    image: {
      type: String,
      required: true,
      default: process.env.DEFAULT_PRODUCT_COVER,
    },
    image_data: { type: String, required: false },
    artist: { type: String, default: 'none' },
    external_url: { type: String, default: 'none' },
    description: { type: String, default: 'none' },
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
*/

module.exports = {
    processMetadata: async (contract, product) => {
        const offers = await Offer.find({
            contract: new ObjectId(contract),
            product,
        }, { diamondRangeIndex: 1 });
        const tokens = await MintedToken.find({
            contract,
            offer: { $in: offers.map((offer) => offer.diamondRangeIndex) },
        });
        const attributes = [];
        const values = [];
        const quantity = [];
        tokens.forEach((token) => {
            token?.metadata?.attributes?.forEach((attr) => {
                if (!attributes.includes(attr.trait_type)) {
                    attributes.push(attr.trait_type);
                    values.push([]);
                    quantity.push([]);
                }
                const aux = attributes.indexOf(attr.trait_type);
                if (!values[aux].includes(attr.value)) {
                    values[aux].push(attr.value);
                    quantity[aux].push(0);
                }
                quantity[aux][values[aux].indexOf(attr.value)] += 1;
            });
        });

        return TokenMetadata.findOneAndUpdate({
            contract,
            product,
        }, {
            attributes: attributes.map((attr, index) => ({
                name: attr,
                values: values[index],
                quantity: quantity[index],
            })),
        }, {
            upsert: true,
        });
    },
};
