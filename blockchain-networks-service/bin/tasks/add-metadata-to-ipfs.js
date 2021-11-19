const _ = require('lodash');
const log = require('../utils/logger')(module);
const { addMetadata, addPin } = require('../integrations/ipfsService')();

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('add metadata to ipfs', { lockLifetime }, async (task, done) => {
    try {
      const { tokenId } = task.attrs.data;

      const foundToken = await context.db.MintedToken.findById(tokenId);

      if (_.isEmpty(foundToken)) return done(new Error(`Token with id ${ tokenId } not found`));

      const CID = await addMetadata(foundToken.metadata, foundToken.metadata.name);
      await addPin(CID, `metadata_${ foundToken.metadata.name }`);
      const metadataURI = `${ process.env.PINATA_GATEWAY }/${ CID }`;

      await context.db.MintedToken.updateOne({ _id: foundToken._id }, { metadataURI })

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
