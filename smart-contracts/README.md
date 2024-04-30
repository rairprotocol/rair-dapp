![Banner](/assets/img/banner.webp)
[![RAIRmarket](https://img.shields.io/badge/RAIR-market-C67FD1)](https://rair.market)
[![RAIRprotocol](https://img.shields.io/badge/RAIR-protocol-C67FD1)](https://rairprotocol.org)
![License](https://img.shields.io/badge/License-Apache2.0-yellow)
[![Discord](https://img.shields.io/badge/Discord-4950AF)](https://discord.gg/vuBUfB7w)
[![Twitter](https://img.shields.io/twitter/follow/rairprotocol)](https://twitter.com/rairprotocol)

# RAIR Smart Contracts
Source code and deployment scripts for RAIR smart contracts.

## Setup
Environment variables  

| Name | Description |
| --- | --- | 
| ETH_MAIN_RPC | RPC endpoint for Ethereum Mainnet |
| SEPOLIA_RPC | RPC endpoint for Ethereum Sepolia | 
| AMOY_RPC | RPC endpoint for Matic Amoy |
| MATIC_RPC | RPC endpoint for Matic Mainnet |
| ADDRESS_PRIVATE_KEY | Private key of the deployer wallet |
| COINMARKETCAP_API_KEY | API Key from coinmarketcap for hardhat's gas price estimations (optional) |
| ETHERSCAN_API_KEY | API key for Etherscan (used for verifying contracts) |
| POLYGONSCAN_API_KEY | API key for Polygonscan (used for verifying contracts) |

## Deploying
Inside the deploy directory you'll find the scripts for all of the diamond contract facets and the 3 main diamond contracts used by the RAIR system:  

| Contract | Description |
| --- | --- |
| Factory | In charge of deploying the ERC721 diamonds |
| Marketplace | Minting and resale offers |
| Facet Source | Diamond contract from which all ERC721 contracts get their facets |

The deployment process is automated, the deployment is done thanks to hardhat-deploy and the verification is done through hardhat-etherscan.  All deployed contracts can be found in the "deployments" directory

## Testing
```npm run test``` will start the local testing on an ethereum mainnet fork, the main test script is under the "test" directory

### Setup
* Factory
    * changeToken(erc20 address, price to deploy)
    * setFacetSource(facet source address)

* Marketplace
    * updateTreasuryAddress(treasury address)
    * updateTreasuryFee(fee)
    * grantRole(RESALE_ADMIN, signer address)