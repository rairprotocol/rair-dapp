import CreditHandler from './CreditHandlerABI.json';
import DiamondFactory from './diamondFactoryABI.json';
import DiamondMarketplace from './diamondMarketplaceABI.json';
import DiamondERC721 from './diamondRAIR721ABI.json';
import LicenseExchange from './LicenseExchangeABI.json';
import MinterMarketplace from './Minter_Marketplace.json';
import ERC721Token from './RAIR_ERC721.json';
import Factory from './RAIR_Token_Factory.json';
import TokenPurchaser from './RAIR_Token_Purchaser.json';
import ERC777 from './RAIR777.json';
import ResaleMarketplace from './Resale_Marketplace.json';

interface FunctionParameter {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
}

interface AbiFragment {
  anonymous?: boolean;
  inputs?: FunctionParameter[];
  outputs?: FunctionParameter[];
  stateMutability?: string;
  name?: string;
  type: string;
}

export type ContractABI = AbiFragment[];
export const diamond721Abi: ContractABI = DiamondERC721.abi;
export const diamondFactoryAbi: ContractABI = DiamondFactory.abi;
export const diamondMarketplaceAbi: ContractABI = DiamondMarketplace.abi;
export const erc721Abi: ContractABI = ERC721Token.abi;
export const minterAbi: ContractABI = MinterMarketplace.abi;
export const resaleAbi: ContractABI = ResaleMarketplace.abi;
export const factoryAbi: ContractABI = Factory.abi;
export const erc777Abi: ContractABI = ERC777.abi;
export const tokenPurchaserAbi: ContractABI = TokenPurchaser.abi;
export const creditHandlerAbi: ContractABI = CreditHandler.abi;
export const licenseExchangeABI: ContractABI = LicenseExchange.abi;
