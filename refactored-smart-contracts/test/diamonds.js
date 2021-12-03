const { expect } = require("chai");

describe("Diamonds", function () {
	let owner, addr1, addr2, addr3, addr4, addrs;
	let ERC777ReceiverFacetFactory, erc777ReceiverFacetInstance;
	let DiamondCutFacetFactory, diamondCutFacetInstance;
	let FactoryDiamondFactory, factoryDiamondInstance;

	
	before(async function() {
		[owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();	
		ERC777ReceiverFacetFactory = await ethers.getContractFactory("ERC777ReceiverFacet");
		DiamondCutFacetFactory = await ethers.getContractFactory("DiamondCutFacet");
		FactoryDiamondFactory = await ethers.getContractFactory("FactoryDiamond");
	})

	describe("Deployment", function() {
		it ("Should deploy the diamondCut facet", async () => {
			diamondCutFacetInstance = await DiamondCutFacetFactory.deploy();
		});

		it ("Should deploy the ERC777Receiver facet", async () => {
			erc777ReceiverFacetInstance = await ERC777ReceiverFacetFactory.deploy();
		});

		it ("Should deploy the base Factory Diamond and emit an event for the first Diamond Cut", async () => {
			factoryDiamondInstance = await FactoryDiamondFactory.deploy(diamondCutFacetInstance.address);
		});

		it ("Should add facets");
		it ("Should replace facets");
		it ("Should remove facets");
	})
})
