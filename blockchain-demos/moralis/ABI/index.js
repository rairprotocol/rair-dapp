const MinterMarketplace = require('./Minter_Marketplace.json');
const Factory = require('./RAIR_Token_Factory.json');
const ERC777 = require('./RAIR777.json');
const ERC721Token = require('./RAIR_ERC721.json');

module.exports = {
	erc721Abi: ERC721Token.abi,
	minterAbi: MinterMarketplace.abi,
	factoryAbi: Factory.abi,
	erc777Abi: ERC777.abi
}