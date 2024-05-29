const { Alchemy } = require('alchemy-sdk');
const { JsonRpcProvider, Network, Contract, isAddress, Wallet } = require('ethers');
const { alchemy } = require('../../config');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger');

const astarMainnet = new Network('Astar Mainnet', 0x250);
const maticTestnet = new Network('Matic Testnet', 0x13881);
const maticMainnet = new Network('Matic Mainnet', 0x89);
const binanceTestnet = new Network('Binance Testnet', 0x61);
const binanceMainnet = new Network('Binance Mainnet', 0x38);
const ethereumMainnet = new Network('Ethereum Mainnet', 0x1);
const ethereumSepolia = new Network('Ethereum Sepolia', 0xaa36a7);
const baseMainnet = new Network('Base Sepolia', 0x2105);

const endpoints = {
    '0x13881': process.env.MATIC_TESTNET_RPC,
    mumbai: process.env.MATIC_TESTNET_RPC,
    '0x89': process.env.MATIC_MAINNET_RPC,
    matic: process.env.MATIC_MAINNET_RPC,
    '0x61': process.env.BINANCE_TESTNET_RPC,
    'binance-testnet': process.env.BINANCE_TESTNET_RPC,
    '0x38': process.env.BINANCE_MAINNET_RPC,
    'binance-mainnet': process.env.BINANCE_MAINNET_RPC,
    '0x1': process.env.ETHEREUM_MAINNET_RPC,
    ethereum: process.env.ETHEREUM_MAINNET_RPC,
    astar: 'https://evm.astar.network', // Temporary hardcode until Alchemy gets fixed
    '0x250': 'https://evm.astar.network',
    '0xaa36a7': process.env.ETHEREUM_TESTNET_SEPOLIA_RPC,
    sepolia: process.env.ETHEREUM_TESTNET_SEPOLIA_RPC,
    base: process.env.BASE_MAINNET_RPC,
    '0x2105': process.env.BASE_MAINNET_RPC,
};

const ethersV6Networks = {
    '0x13881': maticTestnet,
    mumbai: maticTestnet,
    '0x89': maticMainnet,
    matic: maticMainnet,
    '0x61': binanceTestnet,
    'binance-testnet': binanceTestnet,
    '0x38': binanceMainnet,
    'binance-mainnet': binanceMainnet,
    '0x1': ethereumMainnet,
    ethereum: ethereumMainnet,
    astar: astarMainnet,
    '0x250': astarMainnet,
    '0xaa36a7': ethereumSepolia,
    sepolia: ethereumSepolia,
    base: baseMainnet,
    '0x2105': baseMainnet,
};

const getContractRunner = async (
    blockchain,
    rawEthers = false,
    signed = false,
) => {
    let provider;
    if (rawEthers) {
        provider = new JsonRpcProvider(endpoints[blockchain], ethersV6Networks[blockchain], {
            staticNetwork: ethersV6Networks[blockchain],
        });
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
    if (!endpoints[blockchain]) {
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
