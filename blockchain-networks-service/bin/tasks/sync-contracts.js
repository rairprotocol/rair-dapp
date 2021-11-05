const Moralis = require('moralis/node');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { getABIData } = require('../utils/helpers');
const { factoryAbi, erc721Abi } = require('../integrations/ethers/contracts');

const lockLifetime = 1000 * 60 * 5;

module.exports = (context) => {
  context.agenda.define('sync contracts', { lockLifetime }, async (task, done) => {
    try {
      const { network, name } = task.attrs.data;
      const contractsForSave = [];
      const networkData = context.config.blockchain.networks[network];
      const { serverUrl, appId } = context.config.blockchain.moralis[networkData.testnet ? 'testnet' : 'mainnet']

      // Initialize moralis instances
      Moralis.start({ serverUrl, appId });

      await Moralis.Cloud.run(networkData.watchFunction, {
        address: networkData.factoryAddress,
        'sync_historical': true
      });

      const {abi, topic} = getABIData(factoryAbi, 'event', 'NewContractDeployed');
      const options = {
        address: networkData.factoryAddress,
        chain: networkData.network,
        topic,
        abi
      }

      let events = await Moralis.Web3API.native.getContractEvents(options);

      await Promise.all(_.map(events.result, async contract => {
        const nameAbi = getABIData(erc721Abi, 'function', 'name')
        const { token, owner } = contract.data
        const nameOptions = {
          chain: networkData.network,
          address: token,
          function_name: "name",
          abi: [nameAbi.abi]
        };
        const title = await Moralis.Web3API.native.runContractFunction(nameOptions).catch(console.error);

        contractsForSave.push({
          user: owner,
          title,
          contractAddress: token,
          blockchain: networkData.network
        });

        // Listen to this contract's events
        await Moralis.Cloud.run(networkData.watchFunction, {
          address: token.toLowerCase(),
          'sync_historical': true
        });
      }))

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
