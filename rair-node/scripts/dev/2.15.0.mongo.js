// Will update any token image using the moralis gateway to use the ipfs.io gateway
db.MintedToken.updateMany(
  {
    'metadata.image': {
      $regex: 'gateway.moralisipfs.com',
    },
  },
  [
    {
      $set: {
        'metadata.image': {
          $replaceOne: {
            input: '$metadata.image',
            find: 'gateway.moralisipfs.com',
            replacement: 'ipfs.io',
          },
        },
      },
    },
  ],
);
