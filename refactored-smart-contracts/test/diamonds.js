const { expect } = require("chai");

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const initialRAIR777Supply = 1000;
const priceToDeploy = 150;

const firstDeploymentAddress = '0x33791c463B145298c575b4409d52c2BcF743BF67';
const secondDeploymentAddress = '0x9472EF1614f103Ae8f714cCeeF4B438D353Ce1Fa';

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
			acc.push(contract.interface.getSighash(val))
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
	
	before(async function() {
		[owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();	
		ERC777ReceiverFacetFactory = await ethers.getContractFactory("ERC777ReceiverFacet");
		DiamondCutFacetFactory = await ethers.getContractFactory("DiamondCutFacet");
		FactoryDiamondFactory = await ethers.getContractFactory("FactoryDiamond");
		OwnershipFacetFactory = await ethers.getContractFactory("OwnershipFacet");
		DiamondLoupeFacetFactory = await ethers.getContractFactory("DiamondLoupeFacet");
		ERC777Factory = await ethers.getContractFactory("RAIR777");
		CreatorsFacetFactory = await ethers.getContractFactory("creatorFacet");
		ERC721FacetFactory = await ethers.getContractFactory("ERC721Facet");
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
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRair!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 1, firstDeploymentAddress, 'TestRair!');
		});

		it ("Should return excess tokens from the deployment", async() => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRair!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(factoryDiamondInstance.address, factoryDiamondInstance.address, owner.address, 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 2, secondDeploymentAddress, 'TestRair!');
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
				functionSelectors: getSelectors(creatorsFacetInstance).remove(AccessControlFunctions)
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

	describe("RAIR Token Facets", () => {
		it ("Should deploy the Facet", async () => {
			erc721FacetInstance = await ERC721FacetFactory.deploy();
			await erc721FacetInstance.deployed();
		});

		it ("Should add the facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: erc721FacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(erc721FacetInstance).remove(AccessControlFunctions).remove(["supportsInterface(bytes4)"])
			}
			//console.log(receiverFacetItem.functionSelectors)
			//console.log(erc777ReceiverFacetInstance.functions);
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Shouldn't affect the Factory contract!", async () => {
			const proxy721 = await ethers.getContractAt('ERC721Facet', factoryDiamondInstance.address);
			await expect(await proxy721.isApprovedForAll(addr1.address, owner.address)).to.equal(false);
		});
	})

	describe("RAIR Token Instance", () => {
		it ("Should call functions that are defined on the Proxy", async () => {
			const proxy721 = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await proxy721.isApprovedForAll(addr1.address, owner.address)).to.equal(false);
		});
	});

	describe("Loupe Facet", () => {
		it ("Should show all facets", async () => {
			const loupeFacet = await ethers.getContractAt('DiamondLoupeFacet', factoryDiamondInstance.address);
			console.log(await loupeFacet.facets());
		})
	});
})
