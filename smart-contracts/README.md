# RAIR Smart Contracts (Hardhat)

Smart Contract testing and deployment using Ethers.js and Hardhat

# Setup
Install all dependencies with
### `npm i`
The create a .env file on the main directory (this one), you can see an example on the `sample.env` file.
The .env file contains:

For testing:
- ALCHEMY_API: The full URL to the Alchemy API (e.g. https://eth-mainnet.alchemyapi.io/v2/...)
Alchemy provides a 'forked' copy of the ethereum mainnet blockchain, so we can develop and test on top of historical data.
- COINMARKETCAP: The API Key from CoinMarketCap (only the API key!), used by the Hardhat Gas Reporter module to provide Gas Price and current Ethereum price, so we get the cost in $ of every method called and every contract deployed on the testing.

For deployment
- ADDRESS_PRIVATE_KEY: A private key required to deploy a contract, if someone gets hold of this key they can steal your account!

Read more about [dotenv](https://www.npmjs.com/package/dotenv)

# Compiling
Compile contracts using Hardhat with
### `npm run hardhat:compile`
Hardhat is set up to use v0.8.4 of the solidity compiler

# Testing
Compile and test contracts with
### #`npm run hardhat:test`
Tests were written for Hardhat, using mocha and chai

# Deployment
Deploy the factory contract to the Binance Testnet, this only has to happen once!
### `npm run deploy-factory`

Deploy the minter marketplace contract to the Binance Testnet, this only has to happen once!
### `npm run deploy-minter`

Verify a contract on EtherScan/BscScan/PolygonScan
### `npx hardhat verify --network <network> <contract address> <constructor parameters>`
Where the constructor parameters are separated by spaces, any strings or addresses should be wrapped on quotes

Ethers can do deployments as well but the deployment only uses Ethers.js code