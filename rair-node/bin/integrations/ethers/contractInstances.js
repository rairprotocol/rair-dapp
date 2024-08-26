const { Alchemy } = require('alchemy-sdk');
const { JsonRpcProvider, Network, Contract, isAddress, Wallet } = require('ethers');
const { alchemy } = require('../../config');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger');
const { Blockchain } = require('../../models');

const getContractRunner = async (
    blockchain,
    rawEthers = false,
    signed = false,
) => {
    let provider;
    const blockchainData = await Blockchain.findOne({ hash: blockchain });
    const networkData = new Network(blockchainData.name, blockchainData.hash);
    if (rawEthers) {
        provider = new JsonRpcProvider(
            blockchainData.rpcEndpoint,
            networkData,
            {
                staticNetwork: networkData,
            },
        );
    } else {
        const config = {
            apiKey: alchemy.apiKey,
            network: alchemy.networkMapping[blockchain],
        };
        provider = new Alchemy(config);
    }
    if (signed) {
        if (!process.env.WITHDRAWER_PRIVATE_KEY) {
            log.error('No withdrawer key present');
            throw new AppError('Error generating provider');
        }
        return new Wallet(process.env.WITHDRAWER_PRIVATE_KEY, provider);
    }
    return provider;
};

const getInstance = async (
    blockchain,
    contractAddress,
    abi,
    ethers = false,
    signed = false,
) => {
    const provider = await getContractRunner(blockchain, ethers, signed);
    if (!provider) {
        throw Error(`Invalid blockchain requested: ${blockchain}`);
    }
    if (!isAddress(contractAddress)) {
        log.error(`Invalid marketplace instance: ${contractAddress}`);
        throw new AppError('Error generating contract instance');
    }
    const contractInstance = new Contract(
        contractAddress,
        abi,
        provider,
    );
    return contractInstance;
};

module.exports = {
    getInstance,
    getContractRunner,
};
