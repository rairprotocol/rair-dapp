<<<<<<< HEAD
networks: {
  development: {
    host: "localhost",
    port: 8545,
    network_id: "*", // match any network
    websockets: true
  },
  live: {
    host: "localhost", // Random IP for example purposes (do not use)
    port: 80,
    network_id: 1,        // Ethereum public network
    // optional config values:
    // gas
    // gasPrice
    // from - default address to use for any transaction Truffle makes during migrations
    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - function that returns a web3 provider instance (see below.)
    //          - if specified, host and port are ignored.
    // skipDryRun: - true if you don't want to test run the migration locally before the actual migration (default is false)
    // confirmations: - number of confirmations to wait between deployments (default: 0)
    // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default is 50)
    // deploymentPollingInterval: - duration between checks for completion of deployment transactions
    // disableConfirmationListener: - true to disable web3's confirmation listener
=======
module.exports = {
  compilers: {
    solc: {
      version: '0.8.4'
    }
  },

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    },

  ganache:{
    host:'localhost',
    port: 8545,
    network_id: '5777',
  },
  
    live: {
      host: "localhost", // Random IP for example purposes (do not use)
      port: 80,
      network_id: 1,        // Ethereum public network
      // optional config values:
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
      // skipDryRun: - true if you don't want to test run the migration locally before the actual migration (default is false)
      // confirmations: - number of confirmations to wait between deployments (default: 0)
      // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default is 50)
      // deploymentPollingInterval: - duration between checks for completion of deployment transactions
      // disableConfirmationListener: - true to disable web3's confirmation listener
    }
>>>>>>> a157f62f95dda3c55e637923a3257fc84e14db87
  }
}
