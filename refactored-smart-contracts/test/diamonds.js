const { expect } = require("chai");

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const initialRAIR777Supply = 1000;
const priceToDeploy = 150;

const firstDeploymentAddress = '0x33791c463B145298c575b4409d52c2BcF743BF67';
const secondDeploymentAddress = '0x9472EF1614f103Ae8f714cCeeF4B438D353Ce1Fa';

let usedSelectors = {};

const AccessControlFunctions = [
	"grantRole(bytes32,address)",
	"revokeRole(bytes32,address)",
	"hasRole(bytes32,address)",
	"getRoleAdmin(bytes32)"
]

// get function selectors from ABI
function getSelectors (contract) {
	const signatures = Object.keys(contract.interface.functions)
	const selectors = signatures.reduce((acc, val) => {
		if (val !== 'init(bytes)') {
			let selector = contract.interface.getSighash(val);
			if (usedSelectors[selector] !== undefined) {
				console.log('Function', val, 'already exists on', contract.address)	
				return acc;
			}
			usedSelectors[selector] = {
				address: contract.address,
				name: val,
				selector: selector
			};
			acc.push(selector)
		}
		return acc
	}, [])
	selectors.contract = contract
	selectors.remove = remove
	selectors.get = get
	return selectors
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return false
	  }
	}
	return true
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return true
	  }
	}
	return false
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}


describe("Diamonds", function () {
	let owner, addr1, addr2, addr3, addr4, addrs;

	let FactoryDiamondFactory, factoryDiamondInstance;
	
	let DiamondCutFacetFactory, diamondCutFacetInstance;
	let OwnershipFacetFactory, ownershipFacetInstance;
	let DiamondLoupeFacetFactory, diamondLoupeFacetInstance;

	let ERC777ReceiverFacetFactory, erc777ReceiverFacetInstance;
	let CreatorsFacetFactory, creatorsFacetInstance;

	let ERC777Factory, erc777Instance, extraERC777Instance;

	let ERC721FacetFactory, erc721FacetInstance;
	let RAIRMetadataFacetFactory, rairMetadataFacetInstance;
	let RAIRProductFacetFactory, rairProductFacetInstance;
	let RAIRRangesFacetFactory, rairRangesFacetInstance;
	
	before(async function() {
		[owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();	
		// Nick Mudge's facets
		DiamondCutFacetFactory = await ethers.getContractFactory("DiamondCutFacet");
		OwnershipFacetFactory = await ethers.getContractFactory("OwnershipFacet");
		DiamondLoupeFacetFactory = await ethers.getContractFactory("DiamondLoupeFacet");
		
		// Factory
		FactoryDiamondFactory = await ethers.getContractFactory("FactoryDiamond");
		// Factory's facets
		ERC777ReceiverFacetFactory = await ethers.getContractFactory("ERC777ReceiverFacet");
		ERC777Factory = await ethers.getContractFactory("RAIR777");
		CreatorsFacetFactory = await ethers.getContractFactory("creatorFacet");

		// ERC721's Facets
		ERC721FacetFactory = await ethers.getContractFactory("ERC721Facet");
		RAIRMetadataFacetFactory = await ethers.getContractFactory("RAIRMetadataFacet");
		RAIRProductFacetFactory = await ethers.getContractFactory("RAIRProductFacet");
		RAIRRangesFacetFactory = await ethers.getContractFactory("RAIRRangesFacet");

	})

	describe("Deploying external contracts", () => {
		it ("Should deploy two ERC777 contracts", async () => {
			erc777Instance = await ERC777Factory.deploy(initialRAIR777Supply, [addr1.address]);
			extraERC777Instance = await ERC777Factory.deploy(initialRAIR777Supply / 2, [addr2.address]);
			await erc777Instance.deployed();
			await extraERC777Instance.deployed();
		})
	})

	describe("Deploying the Diamond Contract", () => {
		it ("Should deploy the diamondCut facet", async () => {
			diamondCutFacetInstance = await DiamondCutFacetFactory.deploy();
			await diamondCutFacetInstance.deployed();
		});

		it ("Should deploy the base Factory Diamond", async () => {
			factoryDiamondInstance = await FactoryDiamondFactory.deploy(diamondCutFacetInstance.address);
			await factoryDiamondInstance.deployed();
		});

		it ("Should deploy the Diamond Ownership facet", async () => {
			ownershipFacetInstance = await OwnershipFacetFactory.deploy();
			await ownershipFacetInstance.deployed();
		});

		it ("Should deploy the Diamond Loupe facet", async () => {
			diamondLoupeFacetInstance = await DiamondLoupeFacetFactory.deploy();
			await diamondLoupeFacetInstance.deployed();
		});

		it ("Should add the ownership facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const ownershipCutItem = {
				facetAddress: ownershipFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(ownershipFacetInstance)
			}
			//console.log(ownershipFacetInstance.functions);
			await expect(await diamondCut.diamondCut([ownershipCutItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the Loupe facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const loupeFacetItem = {
				facetAddress: diamondLoupeFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(diamondLoupeFacetInstance)
			}
			//console.log(diamondLoupeFacetInstance.functions);
			await expect(await diamondCut.diamondCut([loupeFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should replace facets");
		it ("Should remove facets");
	});

	describe("RAIR Token Receiver", () => {
		it ("Should deploy the ERC777Receiver facet", async () => {
			erc777ReceiverFacetInstance = await ERC777ReceiverFacetFactory.deploy();
			await erc777ReceiverFacetInstance.deployed();
		});

		it ("Should add the facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: erc777ReceiverFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(erc777ReceiverFacetInstance)
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Roles should be set up", async function() {
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.OWNER(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.DEFAULT_ADMIN_ROLE(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.getRoleAdmin(await factoryDiamondInstance.OWNER()))
				.to.equal(await factoryDiamondInstance.OWNER());
			await expect(await factoryDiamondInstance.getRoleAdmin(await factoryDiamondInstance.ERC777()))
				.to.equal(await factoryDiamondInstance.OWNER());
		});

		it ("Should grant ERC777 roles", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			// console.log(receiverFacet.functions);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.DEFAULT_ADMIN_ROLE(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.grantRole(await factoryDiamondInstance.ERC777(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.ERC777(), addr1.address, owner.address);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.ERC777(), addr1.address))
				.to.equal(true);
		});

		it ("Should properly add an ERC777 token to the Receiver Facet", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await receiverFacet.acceptNewToken(erc777Instance.address, priceToDeploy))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.ERC777(), erc777Instance.address, owner.address)
				.to.emit(receiverFacet, 'NewTokenAccepted')
				.withArgs(erc777Instance.address, priceToDeploy, owner.address);
		});

		it ("Should return the deployment cost of an ERC777 contract", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await receiverFacet.getDeploymentCost(erc777Instance.address))
				.to.equal(priceToDeploy);
			await expect(await receiverFacet.getDeploymentCost(extraERC777Instance.address))
				.to.equal(0);
		})

		it ("Shouldn't be able to execute the tokensReceived function from external addresses", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			expect(receiverFacet.tokensReceived(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes(''),  ethers.utils.toUtf8Bytes('')))
					.to.be.revertedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${await factoryDiamondInstance.ERC777()}`);
		});

		it ("Should not deploy a contract if it receives ERC777 tokens from an unapproved ERC777 contract", async () => {
			await expect(extraERC777Instance.send(factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('')))
				.to.be.revertedWith(`AccessControl: account ${extraERC777Instance.address.toLowerCase()} is missing role ${await factoryDiamondInstance.ERC777()}`);
		});

		it ("Should not deploy a contract if it receives less than the required amount", async () => {
			await expect(erc777Instance.send(factoryDiamondInstance.address, priceToDeploy - 1, ethers.utils.toUtf8Bytes('')))
				.to.be.revertedWith(`RAIR Factory: not enough RAIR tokens to deploy a contract`);
		});

		it ("Should deploy a RAIR contract if it receives ERC777 tokens from an approved address", async() => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRairOne!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 1, firstDeploymentAddress, 'TestRairOne!');
		});

		it ("Should return excess tokens from the deployment", async() => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRairTwo!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(factoryDiamondInstance.address, factoryDiamondInstance.address, owner.address, 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 2, secondDeploymentAddress, 'TestRairTwo!');
			await expect(await erc777Instance.balanceOf(owner.address))
				.to.equal(initialRAIR777Supply - (priceToDeploy * 2));
			await expect(await erc777Instance.balanceOf(factoryDiamondInstance.address))
				.to.equal(priceToDeploy * 2);
		});
	});

	describe("RAIR Creators Facet", () => {
		it ("Should deploy the Creators Facet", async() => {
			creatorsFacetInstance = await CreatorsFacetFactory.deploy();
			await creatorsFacetInstance.deployed();
		});

		it ("Should add the facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: creatorsFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(creatorsFacetInstance)//.remove(AccessControlFunctions)
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should return the correct amount of creators", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getCreatorsCount()).to.equal(1);
		});

		it ("Should return the address of the creators", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getCreatorAtIndex(0))
				.to.equal(owner.address);
		});

		it ("Should return the correct amount of contracts deployed by a creator", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getContractCountOf(owner.address)).to.equal(2);
		})

		it ("Should return the contracts deployed by a creator individually", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.creatorToContractIndex(owner.address, 0))
				.to.equal(firstDeploymentAddress);
			await expect(await creatorFacet.creatorToContractIndex(owner.address, 1))
				.to.equal(secondDeploymentAddress);
		})
		
		it ("Should return the contracts deployed by a creator in a full list", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			let contracts = await creatorFacet.creatorToContractList(owner.address);
			await expect(contracts[0]).to.equal(firstDeploymentAddress);
			await expect(contracts[1]).to.equal(secondDeploymentAddress);
		});

		it ("Should return the creator of a token deployed", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.contractToCreator(firstDeploymentAddress))
				.to.equal(owner.address);
			await expect(await creatorFacet.contractToCreator(secondDeploymentAddress))
				.to.equal(owner.address);
		});
	});

	describe("ERC721 Facet", () => {
		it ("Should deploy the ERC721 Facet", async () => {
			erc721FacetInstance = await ERC721FacetFactory.deploy();
			await erc721FacetInstance.deployed();
		});

		it ("Should add the ERC721 facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: erc721FacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(erc721FacetInstance)//.remove(AccessControlFunctions)
					//.remove(["supportsInterface(bytes4)"])
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should have the RAIR symbol", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet.symbol())
				.to.equal("RAIR");
			erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.symbol())
				.to.equal("RAIR");
		});

		it ("Should have the user defined name", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet.name())
				.to.equal("TestRairOne!");
			erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.name())
				.to.equal("TestRairTwo!");
		});

		it ("Shouldn't mint tokens without products");
	});

	describe("RAIR Metadata Facet", () => {
		it ("Should deploy the RAIR Metadata Facet", async () => {
			rairMetadataFacetInstance = await RAIRMetadataFacetFactory.deploy();
			await rairMetadataFacetInstance.deployed();
		});

		it ("Should add the RAIR Metadata facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairMetadataFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairMetadataFacetInstance)//.remove(AccessControlFunctions)
				//.remove(["supportsInterface(bytes4)"])
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});
	});

	describe("RAIR Product Facet", () => {
		it ("Should deploy the RAIR Product Facet", async () => {
		 	//"RAIRProductFacet"
			rairProductFacetInstance = await RAIRProductFacetFactory.deploy();
			await rairProductFacetInstance.deployed();
		});

		it ("Should add the RAIR Product facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairProductFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairProductFacetInstance)//.remove(AccessControlFunctions)
				//.remove(["supportsInterface(bytes4)"])
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should create a product", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', firstDeploymentAddress);
			await expect(await productFacet.createProduct("FirstFirst", 1000))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(0, "FirstFirst", 0, 1000);
			productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.createProduct("SecondFirst", 100))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(0, "SecondFirst", 0, 100);
			await expect(await productFacet.createProduct("SecondSecond", 900))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(1, "SecondSecond", 100, 900);
		});

		it ("Should show information about the products", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', firstDeploymentAddress);
			await expect(await productFacet.getProductCount())
				.to.equal(1);
			await expect(await productFacet.mintedTokensInProduct(0))
				.to.equal(0)

			productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.getProductCount())
				.to.equal(2);
			await expect(await productFacet.mintedTokensInProduct(0))
				.to.equal(0)
			await expect(await productFacet.mintedTokensInProduct(1))
				.to.equal(0)
		})
	});

	describe("RAIR Product Facet", () => {
		it ("Should deploy the RAIR Product Facet", async () => {
		 	//"RAIRRangesFacet"
			rairRangesFacetInstance = await RAIRRangesFacetFactory.deploy();
			await rairRangesFacetInstance.deployed();
		});

		it ("Should add the RAIR Product facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairRangesFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairRangesFacetInstance)//.remove(AccessControlFunctions)
				//.remove(["supportsInterface(bytes4)"])
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should not create offers for invalid products", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			// createRange(uint productId, uint rangeStart, uint rangeEnd, uint price, uint tokensAllowed, uint lockedTokens, string calldata name)
			await expect(rangesFacet.createRange(1, 0, 10, 1000, 950, 50, 'First First First'))
				.to.be.revertedWith('RAIR ERC721: Product does not exist');
		});

		it ("Should create offers", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			await expect(await rangesFacet.createRange(0, 0, 10, 1000, 950, 50, 'First First First'))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 0, 10, 1000, 950, 50, 'First First First', 0);
		});

		it ("Should create offers in batches", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.createRangeBatch(0, [
			{
				rangeStart: 0,
				rangeEnd: 10,
				price: 2000,
				tokensAllowed: 9 ,
				lockedTokens: 1,
				name: 'Second First First'
			}, {
				rangeStart: 11,
				rangeEnd: 99,
				price: 3500,
				tokensAllowed: 50 ,
				lockedTokens: 10,
				name: 'Second First Second'
			},
			]))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 0, 10, 2000, 9, 1, 'Second First First', 0)
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 11, 99, 3500, 50, 10, 'Second First Second', 1);
		});

		it ("Should return the information about the offers", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			const infoZero = await rangesFacet.rangeInfo(0);
			const infoProductZero = await rangesFacet.productRangeInfo(0,0);
			await expect(infoZero.rangeStart)
				.to.equal(infoProductZero.rangeStart)
				.to.equal(0);
			await expect(infoZero.rangeEnd)
				.to.equal(infoProductZero.rangeEnd)
				.to.equal(10);
			await expect(infoZero.tokensAllowed)
				.to.equal(infoProductZero.tokensAllowed)
				.to.equal(950);
			await expect(infoZero.lockedTokens)
				.to.equal(infoProductZero.lockedTokens)
				.to.equal(50);
			await expect(infoZero.rangePrice)
				.to.equal(infoProductZero.rangePrice)
				.to.equal(1000);
			await expect(infoZero.rangeName)
				.to.equal(infoProductZero.rangeName)
				.to.equal('First First First');

			rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			const secondInfoZero = await rangesFacet.rangeInfo(1);
			const secondInfoProductZero = await rangesFacet.productRangeInfo(0,1);
			await expect(secondInfoZero.rangeStart)
				.to.equal(secondInfoProductZero.rangeStart)
				.to.equal(11);
			await expect(secondInfoZero.rangeEnd)
				.to.equal(secondInfoProductZero.rangeEnd)
				.to.equal(99);
			await expect(secondInfoZero.tokensAllowed)
				.to.equal(secondInfoProductZero.tokensAllowed)
				.to.equal(50);
			await expect(secondInfoZero.lockedTokens)
				.to.equal(secondInfoProductZero.lockedTokens)
				.to.equal(10);
			await expect(secondInfoZero.rangePrice)
				.to.equal(secondInfoProductZero.rangePrice)
				.to.equal(3500);
			await expect(secondInfoZero.rangeName)
				.to.equal(secondInfoProductZero.rangeName)
				.to.equal('Second First Second');
		});

		it ("Should update offers", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.updateRange(0, 3750, 45, 5))
				.to.emit(rangesFacet, 'UpdatedRange')
				.withArgs(0, 3750, 45, 5);
			const {rangeStart, rangeEnd, tokensAllowed, lockedTokens, rangePrice, rangeName} = await rangesFacet.productRangeInfo(0,0);
			await expect(rangeStart).to.equal(0);
			await expect(rangeEnd).to.equal(10);
			await expect(tokensAllowed).to.equal(45);
			await expect(lockedTokens).to.equal(5);
			await expect(rangePrice).to.equal(3750);
			await expect(rangeName).to.equal('Second First First');
		});
	});


	describe("Loupe Facet", () => {
		it ("Should show all facets", async () => {
			const loupeFacet = await ethers.getContractAt('DiamondLoupeFacet', factoryDiamondInstance.address);
			console.log(await loupeFacet.facets());
		})
	});
})
