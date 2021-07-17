// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6; 

// Interfaces
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol";

// Parent classes
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';

import 'hardhat/console.sol';
import './Tokens/RAIR-ERC721.sol';

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the reception of ERC777 tokens!
contract RAIR_Token_Factory_V2 is IERC777RecipientUpgradeable, AccessControlUpgradeable {
	IERC1820RegistryUpgradeable internal constant _ERC1820_REGISTRY = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
	
	bytes32 public constant OWNER = keccak256("OWNER");
	bytes32 public constant ERC777 = keccak256("ERC777");

	mapping(address => address[]) public ownerToTokens;
	mapping(address => address) public tokenToOwner;

	mapping(address => uint) public erc777ToNFTPrice;

	address[] public tokenHolders;

	event NewTokensAccepted(address erc777, uint priceForNFT);
	event TokenNoLongerAccepted(address erc777);
	event NewContractDeployed(address owner, uint id, address token);

	/// @notice Factory Constructor
	/// @param  _pricePerToken    Fee given to the node on every sale
	function initialize(uint _pricePerToken, address _rairAddress) public initializer {
		_ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
		_setRoleAdmin(ERC777, OWNER);
		_setupRole(OWNER, msg.sender);
		_setupRole(ERC777, _rairAddress);
		erc777ToNFTPrice[_rairAddress] = _pricePerToken;
		emit NewTokensAccepted(_rairAddress, _pricePerToken);
	}

	function getTokenHoldersCount() public view returns(uint count) {
		return tokenHolders.length;
	} 

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	function add777Token(address _erc777Address, uint _pricePerToken) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		erc777ToNFTPrice[_erc777Address] = _pricePerToken;
		emit NewTokensAccepted(_erc777Address, _pricePerToken);
	}

	/// @notice	Removes an address from the list of allowed minters
	/// @param	_erc777Address	Address of the Token
	function remove777Token(address _erc777Address) public onlyRole(OWNER) {
		revokeRole(ERC777, _erc777Address);
		erc777ToNFTPrice[_erc777Address] = 0;
		emit TokenNoLongerAccepted(_erc777Address);
	}

	/// @notice	Returns the number of contracts deployed by an address
	/// @dev	Use alongside ownerToTokens for the full list of tokens 
	/// @param	_owner	Wallet address to query
	function getContractCount(address _owner) public view returns (uint count) {
		return ownerToTokens[_owner].length;
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
		require(amount >= erc777ToNFTPrice[msg.sender], 'RAIR Factory: not enough RAIR tokens to deploy a contract');
		uint tokensBought = uint((amount / erc777ToNFTPrice[msg.sender]));
		if (amount - (erc777ToNFTPrice[msg.sender] * tokensBought) > 0) {
			IERC777Upgradeable(msg.sender).send(from, amount - (erc777ToNFTPrice[msg.sender] * tokensBought), userData);
		}

		address[] storage tokensFromOwner = ownerToTokens[from];

		for (uint i = 0; i < tokensBought; i++) {
			RAIR_ERC721 newToken = new RAIR_ERC721(string(userData), from, 30000);
			tokensFromOwner.push(address(newToken));
			tokenToOwner[address(newToken)] = from;
			emit NewContractDeployed(from, tokensFromOwner.length, address(newToken));
		}
	}
}