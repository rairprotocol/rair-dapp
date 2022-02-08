const MinterMarketplace = require('./Minter_Marketplace.json');
const Factory = require('./RAIR_Token_Factory.json');
const ERC777 = require('./RAIR777.json');
const ERC721Token = require('./RAIR_ERC721.json');
const DiamondFactory = require('./diamondFactoryABI.json');
const DiamondMarketplace = require('./diamondMarketplaceABI.json');

module.exports = {
	diamondFactoryAbi: DiamondFactory.abi,
	diamondMarketplaceAbi: DiamondMarketplace.abi,
	erc721Abi: ERC721Token.abi,
	minterAbi: MinterMarketplace.abi,
	factoryAbi: Factory.abi,
	erc777Abi: ERC777.abi,
}