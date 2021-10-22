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
        const nameOptions = {
          chain: networkData.network,
          address: contract.data.token,
          function_name: "name",
          abi: [nameAbi.abi]
        };
        const title = await Moralis.Web3API.native.runContractFunction(nameOptions).catch(console.error);

        contractsForSave.push({
          user: contract.data.owner,
          title,
          contractAddress: contract.data.token,
          blockchain: networkData.network
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
