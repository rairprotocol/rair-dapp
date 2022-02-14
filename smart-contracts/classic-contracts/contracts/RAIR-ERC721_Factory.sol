// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9; 

// Interfaces
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

// Parent classes
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import '@openzeppelin/contracts/access/AccessControlEnumerable.sol';

import './Tokens/RAIR-ERC721.sol';

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the reception of ERC777 tokens!
contract RAIR_Token_Factory is IERC777Recipient, AccessControlEnumerable {
	IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
	
	bytes32 public constant OWNER = keccak256("OWNER");
	bytes32 public constant ERC777 = keccak256("ERC777");

	mapping(address => address[]) public ownerToContracts;
	mapping(address => address) public contractToOwner;

	mapping(address => uint) public deploymentCostForERC777;

	address[] public creators;

	event NewTokensAccepted(address erc777, uint priceForNFT);
	event TokenNoLongerAccepted(address erc777);
	event NewContractDeployed(address owner, uint id, address token, string contractName);
	event TokensWithdrawn(address recipient, address erc777, uint amount);

	/// @notice Factory Constructor
	/// @param  _pricePerToken    Tokens required for the deployment
	/// @param  _rairAddress 	  Address of the primary ERC777 contract (RAIR contract)
	constructor(uint _pricePerToken, address _rairAddress) {
		_ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
		_setRoleAdmin(OWNER, OWNER);
		_setRoleAdmin(ERC777, OWNER);
		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_setupRole(OWNER, msg.sender);
		_setupRole(ERC777, _rairAddress);
		deploymentCostForERC777[_rairAddress] = _pricePerToken;
		emit NewTokensAccepted(_rairAddress, _pricePerToken);
	}

	/// @notice Returns the number of addresses that have deployed a contract
	function getCreatorsCount() public view returns(uint count) {
		return creators.length;
	}

	/// @notice Returns the number of contracts deployed by an address
	/// @dev	Use alongside ownerToContracts for the full list of tokens 
	/// @param	deployer	Wallet address to query
	function getContractCountOf(address deployer) public view returns(uint count) {
		return ownerToContracts[deployer].length;
	}

	/// @notice Transfers tokens from the factory to any of the OWNER addresses
	/// @dev 	If the contract has less than the amount, the ERC777 contract will revert
	/// @dev 	AccessControl makes sure only an OWNER can withdraw
	/// @param 	erc777	Address of the ERC777 contract
	/// @param 	amount	Amount of tokens to withdraw
	function withdrawTokens(address erc777, uint amount) public onlyRole(OWNER) {
		require(hasRole(ERC777, erc777), "RAIR Factory: Specified contract isn't an approved erc777 contract");
		IERC777(erc777).send(msg.sender, amount, "Factory Withdraw");
		emit TokensWithdrawn(msg.sender, erc777, amount);
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	function add777Token(address _erc777Address, uint _pricePerToken) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		deploymentCostForERC777[_erc777Address] = _pricePerToken;
		emit NewTokensAccepted(_erc777Address, _pricePerToken);
	}

	/// @notice	Removes an address from the list of allowed minters
	/// @param	_erc777Address	Address of the Token
	function remove777Token(address _erc777Address) public onlyRole(OWNER) {
		revokeRole(ERC777, _erc777Address);
		deploymentCostForERC777[_erc777Address] = 0;
		emit TokenNoLongerAccepted(_erc777Address);
	}

	/// @notice Function called by an ERC777 when they send tokens
	/// @dev    This is our deployment mechanism for ERC721 contracts!
	/// @param operator		The ERC777 operator calling the send() function
	/// @param from			The owner of the tokens
	/// @param to			The recipient of the tokens
	/// @param amount		The number of tokens sent
	/// @param userData		bytes sent from the send call
	/// @param operatorData	bytes sent from the operator
	function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata userData, bytes calldata operatorData) external onlyRole(ERC777) override {
		require(amount >= deploymentCostForERC777[msg.sender], 'RAIR Factory: not enough RAIR tokens to deploy a contract');

		if (amount - (deploymentCostForERC777[msg.sender]) > 0) {
			IERC777(msg.sender).send(from, amount - (deploymentCostForERC777[msg.sender]), userData);
		}
		address[] storage tokensFromOwner = ownerToContracts[from];
		
		if (tokensFromOwner.length == 0) {
			creators.push(from);
		}

		RAIR_ERC721 newToken = new RAIR_ERC721(string(userData), from, 30000);
		tokensFromOwner.push(address(newToken));
		contractToOwner[address(newToken)] = from;
		emit NewContractDeployed(from, tokensFromOwner.length, address(newToken), string(userData));
	}
}