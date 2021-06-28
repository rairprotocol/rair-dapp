const { expect } = require("chai");

describe("Token Factory", function () {
	let owner, addr1, addr2, addr3, addr4, addrs;
	let ERC777Factory, erc777instance, erc777ExtraInstance;
	let FactoryFactory, factoryInstance;
	let RAIR721Factory, rair721Instance;
	let MinterFactory, minterInstance;
	let tokensDeployed;
	const initialSupply = 20;
	const tokenPrice = 5;
	const testTokenName = "RAIR Test Token!";

	before(async function() {
		[owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();	
		ERC777Factory = await ethers.getContractFactory("RAIR777");
		FactoryFactory = await ethers.getContractFactory("RAIR_Token_Factory");
		RAIR721Factory = await ethers.getContractFactory("RAIR_ERC721");
		MinterFactory = await ethers.getContractFactory("Minter_Marketplace");
	});

	describe('Deployments', function() {
		it ("ERC777", async function() {
			erc777instance = await ERC777Factory.deploy(initialSupply, [addr1.address]);
			erc777ExtraInstance = await ERC777Factory.deploy(initialSupply * 2, [addr2.address]);

			expect(await erc777instance.name()).to.equal("RAIR Test");
			expect(await erc777instance.symbol()).to.equal("RAIRTee");
			expect(await erc777instance.decimals()).to.equal(18);
			expect(await erc777instance.granularity()).to.equal(1);
			expect(await erc777instance.totalSupply()).to.equal(initialSupply);

			erc777instance.on('Sent', (from, to, value) => {
				//console.log(from, 'Sent', value.toString(), 'to', to);
			});
		});

		it ("Factory", async function() {
			factoryInstance = await FactoryFactory.deploy(tokenPrice, erc777instance.address);
			expect(await erc777instance.deployed());
		});

		it ("Minter Marketplace", async function() {
			minterInstance = await MinterFactory.deploy();
			expect(await minterInstance.deployed());
		})
	})

	describe('Factory', function() {
		describe('Users', function() {
			it ("Roles should be set up", async function() {
				expect(await factoryInstance.hasRole(await factoryInstance.OWNER(), owner.address)).to.equal(true);
				expect(await factoryInstance.hasRole(await factoryInstance.ERC777(), erc777instance.address)).to.equal(true);
				expect(await factoryInstance.getRoleAdmin(await factoryInstance.ERC777())).to.equal(await factoryInstance.OWNER());
				expect(await factoryInstance.getRoleAdmin(await factoryInstance.OWNER())).to.equal(await factoryInstance.DEFAULT_ADMIN_ROLE());
			});

			it ("Only approved ERC777s can send tokens", async function() {
				expect(erc777ExtraInstance.send(factoryInstance.address, tokenPrice, ethers.utils.toUtf8Bytes('')))
					.to.be.revertedWith(`AccessControl: account ${erc777ExtraInstance.address.toLowerCase()} is missing role ${await factoryInstance.ERC777()}`);
				expect(factoryInstance.tokensReceived(owner.address, owner.address, factoryInstance.address, tokenPrice, ethers.utils.toUtf8Bytes(''),  ethers.utils.toUtf8Bytes('')))
					.to.be.revertedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${await factoryInstance.ERC777()}`);
			});

			it ("Reverts if there aren't enough tokens for at least 1 contract", async function() {
				expect(erc777instance.send(factoryInstance.address, tokenPrice - 1, ethers.utils.toUtf8Bytes('')))
					.to.be.revertedWith('RAIR Factory: not enough RAIR tokens to deploy a contract');
			});

			it ("Deploys an ERC721 contract after an ERC777 transfer", async function() {
				// Should return leftover tokens
				expect(await erc777instance.send(factoryInstance.address, tokenPrice + 1, ethers.utils.toUtf8Bytes(testTokenName))).to.emit(erc777instance, "Sent");
				expect(await erc777instance.balanceOf(owner.address)).to.equal(initialSupply - tokenPrice);
				expect(await erc777instance.balanceOf(factoryInstance.address)).to.equal(tokenPrice);
			});

			it ("Return the ERC777 price of an NFT", async function() {
				expect(await factoryInstance.erc777ToNFTPrice(erc777instance.address)).to.equal(tokenPrice);
			});

			it ("Return the creator's tokens", async function() {
				tokensDeployed = await factoryInstance.tokensByOwner(owner.address);
				expect(tokensDeployed.length).to.equal(1);
			});

			it ("Return the token's creator", async function() {
				expect(await factoryInstance.tokenToOwner(tokensDeployed[0])).to.equal(owner.address);
			});
		});

		describe('Owner', function() {
			it ("Only the owner can add ERC777 tokens", async function() {
				let factoryAsAddress1 = factoryInstance.connect(addr1);
				expect(factoryAsAddress1.grantRole(await factoryInstance.ERC777(), erc777ExtraInstance.address))
					.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await factoryInstance.OWNER()}`);
			});

			it ("Add a new ERC777 token", async function() {
				expect(await factoryInstance.add777Token(erc777ExtraInstance.address, tokenPrice * 2)).to.emit(factoryInstance, 'RoleGranted');
			});

			it ("Mint a token after another ERC777 transfer", async function() {
				expect(await erc777ExtraInstance.send(factoryInstance.address, tokenPrice * 2, ethers.utils.toUtf8Bytes(''))).to.emit(erc777ExtraInstance, "Sent");
				expect(await erc777ExtraInstance.balanceOf(owner.address)).to.equal((initialSupply - tokenPrice) * 2);
				expect(await erc777ExtraInstance.balanceOf(factoryInstance.address)).to.equal(tokenPrice * 2);
				expect((await factoryInstance.tokensByOwner(owner.address)).length).to.equal(2);
				expect(await factoryInstance.tokenToOwner(tokensDeployed[0])).to.equal(owner.address);
			});

			it ("Only the owner can remove an ERC777 token", async function() {
				let factoryAsAddress1 = factoryInstance.connect(addr1);
				expect(factoryAsAddress1.revokeRole(await factoryInstance.ERC777(), erc777ExtraInstance.address))
					.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await factoryInstance.OWNER()}`);
			});

			it ("Remove an ERC777 token", async function() {
				expect(await factoryInstance.remove777Token(erc777ExtraInstance.address)).to.emit(factoryInstance, 'RoleRevoked');
			});

			it ("Only the owner can renounce to his role", async function() {
				let factoryAsAddress1 = factoryInstance.connect(addr1);
				expect(factoryAsAddress1.renounceRole(await factoryInstance.OWNER(), owner.address))
					.to.be.revertedWith(`AccessControl: can only renounce roles for self`);
			});
		});
	})

	describe('RAIR 721', function() {
		describe('Metadata', function() {
			it ("Roles should be set up", async function() {
				rair721Instance = await RAIR721Factory.attach(tokensDeployed[0])
				//console.log(rair721Instance.functions);
				expect(await rair721Instance.hasRole(await rair721Instance.CREATOR(), owner.address)).to.equal(true);
				expect(await rair721Instance.getRoleAdmin(await rair721Instance.MINTER())).to.equal(await rair721Instance.CREATOR());
			});

			it ("Correct creator address", async function() {
				expect(await rair721Instance.getRoleMember(await rair721Instance.CREATOR(), 0)).to.equal(owner.address);
			});

			it ("Correct token name", async function() {
				expect(await rair721Instance.name()).to.equal(testTokenName);
			});

			it ("Correct token symbol", async function() {
				expect(await rair721Instance.symbol()).to.equal("RAIR");
			});

			it ("Only the owner can renounce to his role", async function() {
				let rair721AsAddress1 = rair721Instance.connect(addr1);
				expect(rair721AsAddress1.renounceRole(await rair721Instance.CREATOR(), owner.address))
					.to.be.revertedWith(`AccessControl: can only renounce roles for self`);
			});
		});

		describe('Supply', function() {
			it ("Correct initial supply", async function() {
				expect(rair721Instance.ownerOf(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
			});

			it ("Unauthorized addresses can't mint", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				expect(rair721AsAddress2.mint(addr3.address, 0))
					.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await rair721Instance.MINTER()}`);
			});

			it ("Authorize a Minter", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(false);
				expect(await rair721Instance.grantRole(await rair721Instance.MINTER(), addr2.address)).to.emit(rair721Instance, 'RoleGranted');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(true);
			});

			it ("Creates a Collection", async function() {
				expect(await rair721Instance.getCollectionCount()).to.equal(0);
				expect(await rair721Instance.createCollection("COLLECTION #1", 2, 2)).to.emit(rair721Instance, 'CollectionCreated');
				expect(await rair721Instance.createCollection("COLLECTION #2", 10, 1)).to.emit(rair721Instance, 'CollectionCreated');
				expect(await rair721Instance.createCollection("COLLECTION #3", 170, 50)).to.emit(rair721Instance, 'CollectionCreated');
				expect(await rair721Instance.getCollectionCount()).to.equal(3);
				expect((await rair721Instance.getCollection(0)).collectionName).to.equal("COLLECTION #1");
				expect((await rair721Instance.getCollection(1)).collectionName).to.equal("COLLECTION #2");
				expect((await rair721Instance.getCollection(2)).collectionName).to.equal("COLLECTION #3");
			});

			it ("Minter can mint", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				expect(await rair721AsAddress2.mint(addr3.address, 0)).to.emit(rair721Instance, 'Transfer');
				expect(await rair721AsAddress2.mint(addr4.address, 1)).to.emit(rair721Instance, 'ResaleEnabled');
				expect(await rair721AsAddress2.mint(addr3.address, 0)).to.emit(rair721Instance, 'CollectionCompleted');
				expect(await rair721AsAddress2.mint(addr1.address, 2)).to.emit(rair721Instance, 'Transfer');
			});

			it ("Minter cannot mint once the collection is complete", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				expect(rair721AsAddress2.mint(addr3.address, 0)).to.be.revertedWith('RAIR ERC721: Cannot mint tokens from this collection');
			});

			it ("Unauthorize a Minter", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(true);
				expect(await rair721Instance.revokeRole(await rair721Instance.MINTER(), addr2.address)).to.emit(rair721Instance, 'RoleRevoked');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(false);
				expect(rair721AsAddress2.mint(addr3.address, 0))
					.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await rair721Instance.MINTER()}`);
			});
		});

		describe('Token Data', function() {
			it ("Token Index", async function() {
				expect(await rair721Instance.tokenByIndex(0)).to.equal(0);
				expect(await rair721Instance.tokenByIndex(1)).to.equal(2);
				expect(await rair721Instance.tokenByIndex(2)).to.equal(1);
				expect(await rair721Instance.tokenByIndex(3)).to.equal(12);
			});

			it ("Token Supply", async function() {
				expect(await rair721Instance.totalSupply()).to.equal(4);
			});

			it ("Collection Data", async function() {
				expect(await rair721Instance.tokenToCollection(0)).to.equal(0);
				expect(await rair721Instance.tokenToCollection(1)).to.equal(0);
				expect(await rair721Instance.tokenToCollection(2)).to.equal(1);
				expect(await rair721Instance.tokenToCollection(12)).to.equal(2);
			})

			it ("Token Owners", async function() {
				expect(await rair721Instance.ownerOf(0)).to.equal(addr3.address);
				expect(await rair721Instance.ownerOf(1)).to.equal(addr3.address);
				expect(await rair721Instance.ownerOf(2)).to.equal(addr4.address);
				expect(await rair721Instance.ownerOf(12)).to.equal(addr1.address);
			});

			if ("Token Owners to Collections", async function() {
				expect(await rair721Instance.hasTokenInCollection(addr3.address, 0)).to.equal(true);
				expect(await rair721Instance.hasTokenInCollection(addr3.address, 1)).to.equal(false);
				expect(await rair721Instance.hasTokenInCollection(addr3.address, 2)).to.equal(false);
				
				expect(await rair721Instance.hasTokenInCollection(addr4.address, 0)).to.equal(false);
				expect(await rair721Instance.hasTokenInCollection(addr4.address, 1)).to.equal(true);
				expect(await rair721Instance.hasTokenInCollection(addr4.address, 2)).to.equal(false);
				
				expect(await rair721Instance.hasTokenInCollection(addr1.address, 0)).to.equal(false);
				expect(await rair721Instance.hasTokenInCollection(addr1.address, 1)).to.equal(false);
				expect(await rair721Instance.hasTokenInCollection(addr1.address, 2)).to.equal(true);
			});

			it ("Owner balances", async function() {
				expect(await rair721Instance.balanceOf(owner.address)).to.equal(0);
				expect(await rair721Instance.balanceOf(addr1.address)).to.equal(1);
				expect(await rair721Instance.balanceOf(addr2.address)).to.equal(0);
				expect(await rair721Instance.balanceOf(addr3.address)).to.equal(2);
				expect(await rair721Instance.balanceOf(addr4.address)).to.equal(1);
			});

			it ("Token Indexes by Owner", async function() {
				expect(await rair721Instance.tokenOfOwnerByIndex(addr3.address, 0)).to.equal(0);
				expect(await rair721Instance.tokenOfOwnerByIndex(addr3.address, 1)).to.equal(1);
				expect(await rair721Instance.tokenOfOwnerByIndex(addr4.address, 0)).to.equal(2);
				expect(await rair721Instance.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(12);
			});
		});

		describe('Token Operations', function() {
			it ("Should revert if the resale isn't enabled (First party transfer)", async function() {
				let rair721AsAddress1 = rair721Instance.connect(addr1);
				expect(rair721AsAddress1['safeTransferFrom(address,address,uint256)'](addr1.address, owner.address, 12)).to.revertedWith("RAIR ERC721: Transfers for this collection haven't been enabled");
			});

			it ("Transfers if the resale is enabled", async function() {
				let rair721AsAddress3 = rair721Instance.connect(addr3);
				expect(await rair721AsAddress3['safeTransferFrom(address,address,uint256)'](addr3.address, owner.address, 0)).to.emit(rair721Instance, "Transfer");
			});

			it ("Single approval", async function() {
				let rair721AsAddress4 = await rair721Instance.connect(addr4);
				expect(await rair721AsAddress4.approve(addr2.address, 2))
					.to.emit(rair721Instance, 'Approval')
				expect(await rair721Instance.getApproved(2)).to.equal(addr2.address);
				
				let rair721AsAddress3 = await rair721Instance.connect(addr3);
				expect(await rair721AsAddress3.approve(addr2.address, 1))
					.to.emit(rair721Instance, 'Approval')
				expect(await rair721Instance.getApproved(1)).to.equal(addr2.address);
			});

			it ("Full approval", async function() {
				let rair721AsAddress1 = await rair721Instance.connect(addr1);
				expect(await rair721AsAddress1.setApprovalForAll(addr4.address, true))
					.to.emit(rair721Instance, 'ApprovalForAll');
				expect(await rair721Instance.isApprovedForAll(addr1.address, addr4.address)).to.equal(true);
			});

			it ("Third party transfer", async function() {
				let rair721AsAddress2 = await rair721Instance.connect(addr2);
				//transferFrom(from, to, tokenId) is discouraged by OpenZeppelin
				expect(await rair721Instance.ownerOf(1)).to.equal(addr3.address);
				expect(await rair721AsAddress2['safeTransferFrom(address,address,uint256)'](
					addr3.address, owner.address, 1
				)).to.emit(rair721Instance, 'Transfer');
				expect(await rair721Instance.ownerOf(1)).to.equal(owner.address);
			});

			it ("Should revert if the resale isn't enabled (Third party transfer)", async function() {
				let rair721AsAddress4 = await rair721Instance.connect(addr4);
				expect(await rair721Instance.ownerOf(12)).to.equal(addr1.address);
				expect(rair721AsAddress4['safeTransferFrom(address,address,uint256)'](
					addr1.address, owner.address, 12
				)).to.revertedWith("RAIR ERC721: Transfers for this collection haven't been enabled");
			});
		});

		it ("TODO: Test Transfers from the marketplace ", console.log(''));

		/*
			'DEFAULT_ADMIN_ROLE()': [Function (anonymous)],
			'getRoleMemberCount(bytes32)': [Function (anonymous)],
			'renounceRole(bytes32,address)': [Function (anonymous)],
			'safeTransferFrom(address,address,uint256,bytes)': [Function (anonymous)],
			'supportsInterface(bytes4)': [Function (anonymous)],
			'tokenURI(uint256)': [Function (anonymous)],
		*/
	})

	describe('Minter Marketplace', function() {
		describe("Permissions", function() {
			it ("Refuses to add a collection without a Minter role", async function() {
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				expect(minterInstance.addCollection(rair721Instance.address, 5, 2, 999, owner.address)).to.revertedWith("Minting Marketplace: This Marketplace isn't a Minter!");
			});

			it ("Add a collection", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(false);
				expect(await rair721Instance.grantRole(await rair721Instance.MINTER(), minterInstance.address)).to.emit(rair721Instance, 'RoleGranted');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(true);
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				expect(await minterInstance.addCollection(rair721Instance.address, 5, 2, 999, owner.address)).to.emit(minterInstance, 'AddedCollection');
			});	

			it ("Should mint with permissions", async function() {
				let minterAsAddress2 = await minterInstance.connect(addr2);				
				expect(await minterAsAddress2.buyToken(0, {value: 999})).to.emit(rair721Instance, "Transfer");
			});			

			it ("Shouldn't mint without permissions", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(true);
				expect(await rair721Instance.revokeRole(await rair721Instance.MINTER(), minterInstance.address)).to.emit(rair721Instance, 'RoleRevoked');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(false);
				let minterAsAddress2 = await minterInstance.connect(addr2);
				expect(minterAsAddress2.buyToken(0, {value: 999})).to.revertedWith(`AccessControl: account ${minterInstance.address.toLowerCase()} is missing role ${await rair721Instance.MINTER()}`);
			});

			it ("TODO: Shouldn't mint past the allowed number of tokens");			
			it ("TODO: Shouldn't mint if the collection is completely minted");
			it ("TODO: Shows the number of available tokens");
		})

		it ("721 instance has the default creator fee", async function() {
			expect((await rair721Instance.royaltyInfo(1, 100000, ethers.utils.randomBytes(8)))[1]).to.equal(30000);
		});
	});
})
