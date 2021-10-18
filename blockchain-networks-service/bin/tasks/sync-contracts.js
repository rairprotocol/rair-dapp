const ethers = require('ethers');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const providers = require('../integrations/ethers/providers');
const { abi: Token } = require('../integrations/ethers/contracts/RAIR_ERC721.json');
const { abi: Factory } = require('../integrations/ethers/contracts/RAIR_Token_Factory.json');
const { numberToHexadecimal } = require('../utils/helpers');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming

module.exports = (context) => {
  context.agenda.define('sync contracts', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const contractsForSave = [];
      const providerData = _.find(providers, p => p.network === network);
      const provider = providerData.provider;
      const factoryInstance = await new ethers.Contract(providerData.factoryAddress, Factory, provider);

      // get all users on platform
      const numberOfCreators = await factoryInstance.getCreatorsCount();

      await Promise.all(_.chain()
        .range(numberOfCreators)
        .map(async indexOfUser => {
          const user = await factoryInstance.creators(indexOfUser);
          const numberOfTokens = await factoryInstance.getContractCountOf(user);

          for (let j = 0; j < numberOfTokens; j++) {
            const contractAddress = await factoryInstance.ownerToContracts(user, j);
            const erc721Instance = new ethers.Contract(contractAddress, Token, provider);
            const title = await erc721Instance.name();

            contractsForSave.push({
              user,
              title,
              contractAddress,
              blockchain: numberToHexadecimal(provider._network.chainId)
            });
          }
        })
        .value()
      );

      if (!_.isEmpty(contractsForSave)) {
        try {
          await context.db.Contract.insertMany(contractsForSave, { ordered: false });
        } catch (e) {}
      }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
