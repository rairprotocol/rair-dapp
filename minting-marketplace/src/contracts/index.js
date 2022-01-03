import * as MinterMarketplace from './Minter_Marketplace.json';
import * as Factory from './RAIR_Token_Factory.json';
import * as ERC777 from './RAIR777.json';
import * as ERC721Token from './RAIR_ERC721.json';

export const erc721Abi = ERC721Token.default.abi;
export const minterAbi = MinterMarketplace.default.abi;
export const factoryAbi = Factory.default.abi;
export const erc777Abi = ERC777.default.abi;