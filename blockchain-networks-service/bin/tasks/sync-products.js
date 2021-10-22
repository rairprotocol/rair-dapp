const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { erc721Abi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync products', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const productsForSave = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet'];
      const { abi, topic } = getABIData(erc721Abi, 'event', 'ProductCreated');
      const generalOptions = {
        chain: networkData.network,
        topic,
        abi
      };
      const arrayOfContracts = await context.db.Contract.find({ blockchain: network }).distinct('contractAddress');

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId });

      await Promise.all(_.map(arrayOfContracts, async contract => {
        const options = {
          address: contract,
          ...generalOptions
        };
        const events = await Moralis.Web3API.native.getContractEvents(options);

        await Promise.all(_.map(events.result, async product => {
          const { uid, name, startingToken, length } = product.data;

          productsForSave.push({
            contract,
            collectionIndexInContract: uid,
            name,
            copies: length,
            firstTokenIndex: startingToken
          });
        }));
      }));

      if (!_.isEmpty(productsForSave)) {
        try {
          await context.db.Product.insertMany(productsForSave, { ordered: false });
        } catch (e) {}
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
