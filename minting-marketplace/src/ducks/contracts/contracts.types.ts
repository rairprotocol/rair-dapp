import { ethers } from "ethers";

type AbiInputs = {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
};

type AbiSingleType = {
  anonymous: boolean;
  inputs?: AbiInputs[];
  outputs?: AbiInputs[];
  stateMutability: string;
  name: string;
  type: string;
};

export type AbiType = AbiSingleType[];

export type ContractsInitialType = {
  minterInstance: ethers.Contract | undefined;
  factoryInstance: ethers.Contract | undefined;
  erc777Instance: ethers.Contract | undefined;
  diamondFactoryInstance: ethers.Contract | undefined;
  diamondMarketplaceInstance: ethers.Contract | undefined;
  currentChain: string | undefined;
  currentUserAddress: string | undefined;
  programmaticProvider: ethers.Wallet | undefined;
  contractCreator:
    | undefined
    | ((address: string | undefined, abi: AbiType) => ethers.Contract | undefined);
  realChain: BlockchainType | undefined;
  web3Provider?: undefined | ethers.providers.Web3Provider;
};

export type ContractContents = {
  factory: string | undefined;
  erc777: string | undefined;
  minterMarketplace: string | undefined;
  diamondFactory: string | undefined;
  diamondMarketplace: string | undefined;
};

export type ContractAddressesType = {
  [key: string]: ContractContents;
};

export enum BlockchainData {
    BinanceMainnet = '0x38',
    BinanceTestnet = '0x61',
    EthereumGoerli = '0x5',
    MaticMumbai = '0x13881',
    MaticMainnet = '0x89',
    EthereumMainnet = '0x1'
}

export type BlockchainType = BlockchainData.BinanceMainnet | BlockchainData.BinanceTestnet | BlockchainData.EthereumGoerli | BlockchainData.EthereumMainnet | BlockchainData.MaticMainnet | BlockchainData.MaticMumbai;
