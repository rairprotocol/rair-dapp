const ethers = require('ethers');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { abi: Token } = require('../integrations/ethers/contracts/RAIR_ERC721.json');
const { abi: Factory } = require('../integrations/ethers/contracts/RAIR_Token_Factory.json');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming
const NAME = 'sync contracts';

module.exports = (context) => {
  context.agenda.define('sync contracts', { lockLifetime }, async (task, done) => {
    try {
      const { providerData } = task.attrs.data;
      const provider = new ethers.providers.JsonRpcProvider(providerData.url, providerData.network);
      const factoryInstance = await new ethers.Contract(providerData.factoryAddress, Factory, provider);

      // get all users on platform
      const numberOfCreators = await factoryInstance.getCreatorsCount();

      await Promise.all(_.chain()
        .range(numberOfCreators)
        .map(async indexOfUser => {
          const user = await factoryInstance.creators(indexOfUser);
          const numberOfTokens = await factoryInstance.getContractCountOf(user);
          const foundContracts = await context.db.Contract.find({ user: user.toLowerCase() }).distinct('contractAddress');

          for (let j = 0; j < numberOfTokens; j++) {
            const contractAddress = await factoryInstance.ownerToContracts(user, j);
            const contract = contractAddress.toLowerCase();
            const erc721Instance = new ethers.Contract(contract, Token, provider);
            const title = await erc721Instance.name();

            if (!_.includes(foundContracts, contract)) {
              await context.db.Contract.create({ // FIXME: make a bulkwrite
                user,
                title,
                contractAddress: contract,
                blockchain: provider._network.symbol
              });

              log.info(`[${ NAME }] Stored Contract ${ contract } for User ${ user } from network ${ provider._network.name }`);
            }
          }
        })
        .value());

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
