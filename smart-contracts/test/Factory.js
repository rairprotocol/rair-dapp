const { expect } = require("chai");
const { upgrades } = require("hardhat");

describe("Token Factory", function () {
	let owner, addr1, addr2, addr3, addr4, addrs;
	let ERC777Factory, erc777instance, erc777ExtraInstance;
	let FactoryFactory, factoryInstance;
	let RAIR721Factory, rair721Instance;
	let MinterFactory, minterInstance;
	const initialSupply = 20;
	const tokenPrice = 5;
	const testTokenName = "RAIR Test Token!";
	const collection1Limit = 2;
	const collection2Limit = 10;
	const collection3Limit = 170;

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

			/*
			*	Events:
			*	erc777instance.on('Sent', (from, to, value) => {
			*		console.log(from, 'Sent', value.toString(), 'to', to);
			*	});
			*/
		});

	})

	describe('Upgradeable Deployments', function() {
		it ("Factory", async function() {
			/*
			*	Normal deployment:
			*	variable = await ContractFactory.deploy(...params);
			*	factoryInstance = await FactoryFactory.deploy(tokenPrice, erc777instance.address);
			*
			*	Upgradeable deployment
			*	variable = await upgrades.deployProxy(ContractFactory, [...params])
			*/
			factoryInstance = await upgrades.deployProxy(FactoryFactory, [tokenPrice, erc777instance.address]);
		});

		it ("Minter Marketplace", async function() {
			minterInstance = await upgrades.deployProxy(MinterFactory, [erc777instance.address, 9000, 1000]);
		})
	})

	describe('Factory', function() {
		/*describe('Upgrades', function() {
			it ("Should upgrade", async function() {
				let FactoryV2 = await ethers.getContractFactory("RAIR_Token_Factory_V2");
				factoryInstance = await upgrades.upgradeProxy(factoryInstance.address, FactoryV2);
			});
		});*/

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
				expect(await erc777instance.send(factoryInstance.address, tokenPrice + 1, ethers.utils.toUtf8Bytes(testTokenName))).to.emit(erc777instance, "Sent").to.emit(factoryInstance, 'NewContractDeployed');
				expect(await erc777instance.balanceOf(owner.address)).to.equal(initialSupply - tokenPrice);
				expect(await erc777instance.balanceOf(factoryInstance.address)).to.equal(tokenPrice);
			});

			it ("Should track number of token holders", async function() {
				expect(await factoryInstance.getCreatorsCount()).to.equal(1);
			});

			it ("Should store the addresses of the token holders", async function() {
				expect(await factoryInstance.creators(0)).to.equal(owner.address)
			});

			it ("Return the ERC777 price of an NFT", async function() {
				expect(await factoryInstance.deploymentCostForERC777(erc777instance.address)).to.equal(tokenPrice);
			});

			it ("Return the creator's tokens", async function() {
				expect(await factoryInstance.getContractCountOf(owner.address)).to.equal(1);
			});

			it ("Return the token's creator", async function() {
				expect(await factoryInstance.contractToOwner(await factoryInstance.ownerToContracts(owner.address, 0))).to.equal(owner.address);
			});
		});

		describe('Withdrawals', function() {
			it ("Cannot withdraw from tokens without the role", async function() {
				await expect(factoryInstance.withdrawTokens(erc777ExtraInstance.address, tokenPrice)).to.revertedWith("RAIR Factory: Specified contract isn't an approved erc777 contract");
			});

			it ("Cannot withdraw more than the balance", async function() {
				await expect(factoryInstance.withdrawTokens(erc777instance.address, tokenPrice + 1)).to.revertedWith("ERC777: transfer amount exceeds balance");
			});

			it ("Owners should withdraw tokens", async function() {
				expect(await factoryInstance.withdrawTokens(erc777instance.address, tokenPrice)).to.emit(factoryInstance, 'TokensWithdrawn').withArgs(owner.address, erc777instance.address, tokenPrice);
			});
		});

		describe('Owner', function() {
			it ("Only the owner can add ERC777 tokens", async function() {
				let factoryAsAddress1 = factoryInstance.connect(addr1);
				expect(factoryAsAddress1.grantRole(await factoryInstance.ERC777(), erc777ExtraInstance.address))
					.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await factoryInstance.OWNER()}`);
			});

			it ("Add a new ERC777 token", async function() {
				expect(await factoryInstance.add777Token(erc777ExtraInstance.address, tokenPrice * 2)).to.emit(factoryInstance, 'RoleGranted').to.emit(factoryInstance, 'NewTokensAccepted');
			});

			it ("Mint a token after another ERC777 transfer", async function() {
				expect(await erc777ExtraInstance.send(factoryInstance.address, tokenPrice * 2, ethers.utils.toUtf8Bytes(''))).to.emit(erc777ExtraInstance, "Sent").to.emit(factoryInstance, 'NewContractDeployed');
				expect(await erc777ExtraInstance.balanceOf(owner.address)).to.equal((initialSupply - tokenPrice) * 2);
				expect(await erc777ExtraInstance.balanceOf(factoryInstance.address)).to.equal(tokenPrice * 2);
				expect(await factoryInstance.getContractCountOf(owner.address)).to.equal(2);
				expect(await factoryInstance.contractToOwner(await factoryInstance.ownerToContracts(owner.address, 0))).to.equal(owner.address);
			});

			it ("Only the owner can remove an ERC777 token", async function() {
				let factoryAsAddress1 = factoryInstance.connect(addr1);
				expect(factoryAsAddress1.revokeRole(await factoryInstance.ERC777(), erc777ExtraInstance.address))
					.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await factoryInstance.OWNER()}`);
			});

			it ("Remove an ERC777 token", async function() {
				expect(await factoryInstance.remove777Token(erc777ExtraInstance.address)).to.emit(factoryInstance, 'RoleRevoked').to.emit(factoryInstance, 'TokenNoLongerAccepted');
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
				rair721Instance = await RAIR721Factory.attach(await factoryInstance.ownerToContracts(owner.address, 0))
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
			it ("Should display correct initial supply", async function() {
				expect(rair721Instance.ownerOf(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
			});

			it ("Should not show next index for nonexistent collections", async function() {
				await expect(rair721Instance.getNextSequentialIndex(0, 0, 0)).to.revertedWith("RAIR ERC721: Collection does not exist");
			})

			it ("Should create a Collection", async function() {
				await expect(await rair721Instance.getCollectionCount()).to.equal(0);
				await expect(await rair721Instance.createCollection("COLLECTION #1", collection1Limit)).to.emit(rair721Instance, 'CollectionCreated').withArgs(0, 'COLLECTION #1', collection1Limit);
				await expect(await rair721Instance.createCollection("COLLECTION #2", collection2Limit)).to.emit(rair721Instance, 'CollectionCreated').withArgs(1, 'COLLECTION #2', collection2Limit);
				await expect(await rair721Instance.createCollection("COLLECTION #3", collection3Limit)).to.emit(rair721Instance, 'CollectionCreated').withArgs(2, 'COLLECTION #3', collection3Limit);
				await expect(await rair721Instance.getCollectionCount()).to.equal(3);
				await expect((await rair721Instance.getCollection(0)).collectionName).to.equal("COLLECTION #1");
				await expect((await rair721Instance.getCollection(1)).collectionName).to.equal("COLLECTION #2");
				await expect((await rair721Instance.getCollection(2)).collectionName).to.equal("COLLECTION #3");
			});

			it ("Should show the next index for collections", async function() {
				expect(await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit)).to.equal(0);
				expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(0);
				expect(await rair721Instance.getNextSequentialIndex(2, 0, collection3Limit)).to.equal(0);
			})

			it ("Shouldn't let unauthorized addresses mint", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				let next = await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit);
				expect(next).to.equal(0);
				await expect(rair721AsAddress2.mint(addr3.address, 0, next))
					.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await rair721Instance.MINTER()}`);
				expect(await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit)).to.equal(next);
			});

			it ("Authorize a Minter", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(false);
				expect(await rair721Instance.grantRole(await rair721Instance.MINTER(), addr2.address)).to.emit(rair721Instance, 'RoleGranted');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(true);
			});

			it ("Locks - Shouldn't lock ranges with tokens outside the collection's range", async function() {
				await expect(rair721Instance.createRangeLock(0, 0, 2, 2)).to.be.revertedWith('RAIR ERC721: Invalid ending token');
				// Invalid starting token
				await expect(rair721Instance.createRangeLock(0, -1, 1, 2)).to.be.reverted;
				await expect(rair721Instance.createRangeLock(1, 0, 9, 11)).to.be.revertedWith('RAIR ERC721: Invalid number of tokens to lock');
			});

			it ("Locks - Should lock ranges inside collections", async function() {
				await expect(await rair721Instance.createRangeLock(0, 0, 1, 2)).to.emit(rair721Instance, 'RangeLocked').withArgs(0, 0, 1, 2, 'COLLECTION #1');
				await expect(await rair721Instance.createRangeLock(1, 0, 4, 3)).to.emit(rair721Instance, 'RangeLocked').withArgs(1, 2, 6, 3, 'COLLECTION #2');
				await expect(await rair721Instance.createRangeLock(1, 5, 9, 5)).to.emit(rair721Instance, 'RangeLocked').withArgs(1, 7, 11, 5, 'COLLECTION #2');
				await expect(await rair721Instance.createRangeLock(2, 0, 169, 10)).to.emit(rair721Instance, 'RangeLocked').withArgs(2, 12, 181, 10, 'COLLECTION #3');
			});

			it ("Should let minters mint tokens", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);

				let next = await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit);
				await expect(next).to.equal(0);
				await expect(await rair721AsAddress2.mint(addr3.address, 0, next)).to.emit(rair721Instance, 'Transfer').withArgs(ethers.constants.AddressZero, addr3.address, next);
				await expect(await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit)).to.equal(await next.add(1));
				
				next = await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit);
				await expect(next).to.equal(0);
				await expect(await rair721AsAddress2.mint(addr4.address, 1, next)).to.emit(rair721Instance, 'Transfer').withArgs(ethers.constants.AddressZero, addr4.address, next + 2);
				await expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(await next.add(1));
				
				next = await rair721Instance.getNextSequentialIndex(0, 0, collection1Limit);
				await expect(next).to.equal(1);
				await expect(await rair721AsAddress2.mint(addr3.address, 0, next))
					.to.emit(rair721Instance, 'CollectionCompleted')
						.withArgs(0, 'COLLECTION #1')
					.to.emit(rair721Instance, 'RangeUnlocked')
						.withArgs(0, 0, 1);
				await expect(rair721Instance.getNextSequentialIndex(0, 0, collection1Limit)).to.be.revertedWith("RAIR ERC721: There are no available tokens in this range");
				
				next = await rair721Instance.getNextSequentialIndex(2, 0, collection3Limit);
				await expect(next).to.equal(0);
				await expect(await rair721AsAddress2.mint(addr1.address, 2, next)).to.emit(rair721Instance, 'Transfer').withArgs(ethers.constants.AddressZero, addr1.address, 12);
				await expect(await rair721Instance.getNextSequentialIndex(2, 0, collection3Limit)).to.equal(next.add(1));
			});

			it ("Minter cannot mint once the collection is complete", async function() {
				await expect(rair721Instance.getNextSequentialIndex(0, 0, collection1Limit)).to.be.revertedWith('RAIR ERC721: There are no available tokens in this range');
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				await expect(rair721AsAddress2.mint(addr3.address, 0, 2)).to.be.revertedWith('RAIR ERC721: Invalid token index');
			});

			it ("Unauthorize a Minter", async function() {
				let rair721AsAddress2 = rair721Instance.connect(addr2);
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(true);
				expect(await rair721Instance.revokeRole(await rair721Instance.MINTER(), addr2.address)).to.emit(rair721Instance, 'RoleRevoked');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), addr2.address)).to.equal(false);
				let next = await rair721Instance.getNextSequentialIndex(2, 0, collection3Limit);
				expect(next).to.equal(1);
				expect(rair721AsAddress2.mint(addr3.address, 2, next))
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

			it ("Internal Token Indexes", async function() {
				expect(await rair721Instance.tokenToCollectionIndex(0)).to.equal(0);
				expect(await rair721Instance.tokenToCollectionIndex(1)).to.equal(1);
				expect(await rair721Instance.tokenToCollectionIndex(2)).to.equal(0);
				expect(await rair721Instance.tokenToCollectionIndex(12)).to.equal(0);
			});
		});

		

		describe('Token Operations', function() {
			it ("Should revert if the resale isn't enabled (First party transfer)", async function() {
				let rair721AsAddress1 = rair721Instance.connect(addr1);
				await expect(rair721AsAddress1['safeTransferFrom(address,address,uint256)'](addr1.address, owner.address, 12))
					.to.be.revertedWith("RAIR ERC721: Transfers for this range are currently locked");
			});

			it ("Should revert if a transfer is made by someone without the trader role", async function() {
				let rair721AsAddress3 = rair721Instance.connect(addr3);
				await expect(rair721AsAddress3['safeTransferFrom(address,address,uint256)'](addr3.address, owner.address, 0))
					.to.be.revertedWith(`AccessControl: account ${addr3.address.toLowerCase()} is missing role ${await rair721Instance.TRADER()}`);
			});

			it ("Transfers if the resale is enabled and is an approved trader", async function() {
				let rair721AsAddress3 = rair721Instance.connect(addr3);
				await rair721Instance.grantRole(await rair721Instance.TRADER(), addr3.address);
				await expect(await rair721AsAddress3['safeTransferFrom(address,address,uint256)'](addr3.address, owner.address, 0)).to.emit(rair721Instance, "Transfer");
				await rair721Instance.revokeRole(await rair721Instance.TRADER(), addr3.address);
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
				await rair721Instance.grantRole(await rair721Instance.TRADER(), addr2.address);
				expect(await rair721AsAddress2['safeTransferFrom(address,address,uint256)'](
					addr3.address, owner.address, 1
				)).to.emit(rair721Instance, 'Transfer');
				await rair721Instance.revokeRole(await rair721Instance.TRADER(), addr2.address);
				expect(await rair721Instance.ownerOf(1)).to.equal(owner.address);
			});

			it ("Should revert if the resale isn't enabled (Third party transfer)", async function() {
				let rair721AsAddress4 = await rair721Instance.connect(addr4);
				expect(await rair721Instance.ownerOf(12)).to.equal(addr1.address);
				expect(rair721AsAddress4['safeTransferFrom(address,address,uint256)'](
					addr1.address, owner.address, 12
				)).to.revertedWith("RAIR ERC721: Transfers for this range are currently locked");
			});
		});

		it ("TODO: Test DEFAULT_ADMIN_ROLE");
		it ("TODO: Test getRoleMemberCount");
		it ("TODO: Test renounceRole");
		it ("TODO: Test safeTransferFrom");
		it ("TODO: Test supportsInterface");
		it ("TODO: Test tokenURI");
	})

	describe('Minter Marketplace', function() {
		describe("Minting Permissions", function() {
			it ("Refuses to add a collection without a Minter role", async function() {
				// Token Address, Product Index, (internal) Starting Token, (internal) Starting Token, Range Price, Range Name, Node Address
				await expect(minterInstance.addOffer(
					rair721Instance.address, 	// Token Address
					1,							// Product Index
					[0,2,6],					// Starting token in Range
					[1,5,9],					// Ending token in Range
					[1000,500,100],				// Price
					['Deluxe','Standard'],		// Range Name
					owner.address				// Node Address
				)).to.be.revertedWith("Minting Marketplace: This Marketplace isn't a Minter!");
			});

			it ("Grants Marketplace Minter Role", async function() {
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(false);
				expect(await rair721Instance.grantRole(await rair721Instance.MINTER(), minterInstance.address)).to.emit(rair721Instance, 'RoleGranted').withArgs(await rair721Instance.MINTER(), minterInstance.address, owner.address);
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(true);
			});
		});

		describe("Adding Collections and Minting", function() {
			// Deprecated in the range update
			/*it ("Refuses to add a number of tokens higher than the mintable limit", async function() {
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				//console.log(await rair721Instance.getCollection(1));
				await expect(minterInstance.addOffer(
					rair721Instance.address, 	// Token Address
					1,							// Product Index
					[0],						// Starting token in Range
					[10],						// Ending token in Range  /// ERROR HERE, 10 tokens means 0 to 9, 10 is an invalid token
					[1000],						// Price
					['Deluxe'],					// Range Name
					owner.address				// Node Address
				)).to.revertedWith("Minting Marketplace: Collection doesn't have that many tokens to mint!");
			});*/

			it ("Refuses to add a range with wrong lengths", async function() {
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				//console.log(await rair721Instance.getCollection(1));
				await expect(minterInstance.addOffer(
					rair721Instance.address, 	// Token Address
					1,							// Product Index
					[0, 2],						// Starting token in Range /// ERROR HERE, this one has 2 elements while the rest has only 1
					[10],						// Ending token in Range
					[1000],						// Price
					['Deluxe'],					// Range Name
					owner.address				// Node Address
				)).to.revertedWith("Minting Marketplace: Offer's ranges should have the same length!");
			});

			it ("Should add an offer", async function() {
				// Token Address, Tokens Allowed, Collection Index, Token Price, Node Address
				expect(await minterInstance.addOffer(
					rair721Instance.address, 			// Token Address
					1,									// Product Index
					[0,3],							// Starting token in Range
					[2,5],							// Ending token in Range
					[999,500],						// Price
					['Deluxe','Special'],	// Range Name
					owner.address						// Node Address
				)).to.emit(minterInstance, 'AddedOffer').withArgs(rair721Instance.address, 1, 2, 0);
				expect(await minterInstance.openSales()).to.equal(2);
			});

			it ("Should append a range to an existing offer", async function() {
				expect(await minterInstance.appendOfferRange(
					0,									// Catalog index
					6,									// Starting token in Range
					9,									// Ending token in Range
					100,								// Price
					'Standard'							// Range Name
					//	event AppendedRange(address contractAddress, uint productIndex, uint offerIndex, uint rangeIndex,  uint startToken, uint endToken, uint price, string name);
				)).to.emit(minterInstance, 'AppendedRange').withArgs(rair721Instance.address, 1, 0, 2, 6, 9, 100, 'Standard');
				expect(await minterInstance.openSales()).to.equal(3);
			});

			it ("Should mint with permissions", async function() {
				let minterAsAddress2 = await minterInstance.connect(addr2);
				let next = await rair721Instance.getNextSequentialIndex(1, 0, 2);
				expect(next).to.equal(1);
				expect(await minterAsAddress2.buyToken(0, 0, next, {value: 999})).to.emit(rair721Instance, "Transfer").withArgs(ethers.constants.AddressZero, addr2.address, next.add(2));
				expect(await rair721Instance.getNextSequentialIndex(1, 0, 2)).to.equal(2);
				await expect(rair721Instance.getNextSequentialIndex(1, 0, 1)).to.be.revertedWith('RAIR ERC721: There are no available tokens in this range');
			});

			it ("Shouldn't mint without permissions", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(true);
				expect(await rair721Instance.revokeRole(await rair721Instance.MINTER(), minterInstance.address)).to.emit(rair721Instance, 'RoleRevoked');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(false);
				let minterAsAddress2 = await minterInstance.connect(addr2);
				let next = await rair721Instance.getNextSequentialIndex(1, 0, 2);
				expect(next).to.equal(2);
				await expect(minterAsAddress2.buyToken(0, 0, next, {value: 999})).to.revertedWith(`AccessControl: account ${minterInstance.address.toLowerCase()} is missing role ${await rair721Instance.MINTER()}`);
				expect(await rair721Instance.getNextSequentialIndex(1, 0, 2)).to.equal(next);
			});

			it ("Shouldn't mint past the allowed number of tokens", async function() {
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(false);
				expect(await rair721Instance.grantRole(await rair721Instance.MINTER(), minterInstance.address)).to.emit(rair721Instance, 'RoleGranted');
				expect(await rair721Instance.hasRole(await rair721Instance.MINTER(), minterInstance.address)).to.equal(true);
				let minterAsAddress2 = await minterInstance.connect(addr2);

				let next = await rair721Instance.getNextSequentialIndex(1, 0, 2);
				expect(next).to.equal(2);

				expect(await minterInstance.openSales()).to.equal(3);
				
				expect(await minterAsAddress2.buyToken(0, 0, next, {value: 999})).to.emit(rair721Instance, "Transfer").to.changeEtherBalances([owner, addr2, erc777instance], [899 + 9, -999, 89]);
				
				for await (item of [3,4,5]) {
					let next = await rair721Instance.getNextSequentialIndex(1, 3, 5);
					expect(next).to.equal(item);
					expect(await minterAsAddress2.buyToken(0, 1, next, {value: 500})).to.emit(rair721Instance, "Transfer").to.changeEtherBalances([owner, addr2, erc777instance], [455, -500, 45]);
					expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(Number(next) + 1);
				}

				expect(await minterInstance.openSales()).to.equal(2);

				next = await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit);
				expect(next).to.equal(6);
				await expect(minterAsAddress2.buyToken(0, 1, next, {value: 500})).to.revertedWith('Minting Marketplace: Cannot mint more tokens for this range!');
				expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(next);
			});
		});

		describe("Updating Collections", function() {
			it ("Shouldn't let the creator update the collection info limits with wrong info", async () => {
				await expect(minterInstance.updateOfferRange(0, 0, 0, 3, 999, 'Revised Deluxe')).to.be.revertedWith('Minting Marketplace: New limits must be within the previous limits!');
			});

			it ("Should let the creator update the collection info limits", async () => {
				expect(await minterInstance.updateOfferRange(0, 0, 1, 2, 999, 'Revised Deluxe')).to.emit(minterInstance, 'UpdatedOffer').withArgs(rair721Instance.address, 0, 0, 0, 999, 'Revised Deluxe');
			});

			it ("Shouldn't mint out of bounds", async function() {
				// Collection #1 has 10 tokens, but it includes 0, so the last mintable token should be #9
				let minterAsAddress2 = await minterInstance.connect(addr2);
				await expect(minterAsAddress2.buyToken(0, 2, 10, {value: 29999})).to.be.revertedWith("Minting Marketplace: Token doesn't belong in that offer range!");
				await expect(minterAsAddress2.buyToken(0, 2, 5, {value: 29999})).to.be.revertedWith("Minting Marketplace: Token doesn't belong in that offer range!");
			});

			it ("Should mint specific tokens", async function() {
				let minterAsAddress2 = await minterInstance.connect(addr2);
				expect(await minterAsAddress2.buyToken(0, 2, 8, {value: 29999})).to.emit(rair721Instance, "Transfer").to.changeEtherBalances([owner, addr2, erc777instance], [91, -100, 9]);
				expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(6);
			});
			
			it ("Shouldn't mint if the collection is completely minted", async () => {
				let minterAsAddress2 = await minterInstance.connect(addr2);
				// Insufficient funds test
				let next = Number(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit));
				await expect(next).to.equal(6);
				await expect(minterAsAddress2.buyToken(0, 2, next, {value: 99})).to.revertedWith("Minting Marketplace: Insuficient Funds!");
				await expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(next);
				
				await expect(await minterAsAddress2.buyToken(0, 2, next, {value: 100})).to.emit(rair721Instance, "Transfer").to.changeEtherBalances([owner, addr2, erc777instance], [91, -100, 9]);
				await expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(Number(next) + 1);

				// 8 is already minted, so after minting next sequential index should be 9
				next = Number(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit));
				await expect(next).to.equal(7);
				await expect(await minterAsAddress2.buyToken(0, 2, next, {value: 19999})).to.emit(rair721Instance, "Transfer").to.changeEtherBalances([owner, addr2, erc777instance], [91, -100, 9]);
				await expect(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.equal(Number(next) + 2);
				
				next = Number(await rair721Instance.getNextSequentialIndex(1, 0, collection2Limit));
				await expect(next).to.equal(9);
				await expect(await minterAsAddress2.buyToken(0, 2, next, {value: 999999999})).to.emit(rair721Instance, "CollectionCompleted").to.changeEtherBalances([owner, addr2, erc777instance], [91, -100, 9]);

				await expect(rair721Instance.getNextSequentialIndex(1, 0, collection2Limit)).to.be.revertedWith('RAIR ERC721: There are no available tokens in this range.');
				await expect(minterAsAddress2.buyToken(0, 2, next + 1, {value: 9999})).to.be.revertedWith('Minting Marketplace: Cannot mint more tokens for this range!');
				await expect(minterAsAddress2.buyToken(0, 3, next + 1, {value: 9999})).to.be.revertedWith('Minting Marketplace: Invalid range!');
			});
		})

		it ("721 instance returns the correct creator fee", async function() {
			expect((await rair721Instance.royaltyInfo(1, 100000, ethers.utils.randomBytes(8)))[0]).to.equal(owner.address);
			expect((await rair721Instance.royaltyInfo(1, 100000, ethers.utils.randomBytes(8)))[1]).to.equal(30000);
		});
	});
})
