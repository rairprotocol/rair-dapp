// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import '@openzeppelin/contracts/access/AccessControl.sol';

import 'hardhat/console.sol';
import './RAIR-ERC721.sol';

contract RAIR_Token_Factory is IERC777Recipient, AccessControl {
	IERC1820Registry internal constant _ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
	
	bytes32 public constant OWNER = keccak256("OWNER");
	bytes32 public constant ERC777 = keccak256("ERC777");

	mapping(address => address[]) ownerToTokens;
	mapping(address => address) public tokenToOwner;

	mapping(address => uint) public erc777ToNFTPrice;

	/// @notice Factory Constructor
	/// @param  _pricePerToken    Fee given to the node on every sale
	constructor(uint _pricePerToken, address _rairAddress) {
		_ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
		_setRoleAdmin(ERC777, OWNER);
		_setupRole(OWNER, msg.sender);
		_setupRole(ERC777, _rairAddress);
		erc777ToNFTPrice[_rairAddress] = _pricePerToken;
	}

	/// @notice	Adds an address to the list of allowed minters
	/// @param	_erc777Address	Address of the new Token
	function add777Token(address _erc777Address, uint _pricePerToken) public onlyRole(OWNER) {
		grantRole(ERC777, _erc777Address);
		erc777ToNFTPrice[_erc777Address] = _pricePerToken;
	}

	/// @notice	Removes an address from the list of allowed minters
	/// @param	_erc777Address	Address of the Token
	function remove777Token(address _erc777Address) public onlyRole(OWNER) {
		revokeRole(ERC777, _erc777Address);
		erc777ToNFTPrice[_erc777Address] = 0;
	}

	/// @notice	Displays the entire list of Tokens owned by a creator
	/// @param	_owner	Address of the Token
	function tokensByOwner(address _owner) public view returns (address[] memory) {
		return ownerToTokens[_owner];
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
		//console.log('Operator', operator);
		//console.log('From contract', msg.sender);
		//console.log('From', from);
		//console.log('To', to);
		//console.log('Got',amount,'tokens');
		//console.log('At',erc777ToNFTPrice[msg.sender],'per token');
		uint tokensBought = uint((amount / erc777ToNFTPrice[msg.sender]));
		//console.log("That's",tokensBought,'tokens to be minted');
		//console.log("Returning",amount - (erc777ToNFTPrice[msg.sender] * tokensBought),'tokens');
		if (amount - (erc777ToNFTPrice[msg.sender] * tokensBought) > 0) {
			IERC777(msg.sender).send(from, amount - (erc777ToNFTPrice[msg.sender] * tokensBought), userData);
		}

		for (uint i = 0; i < tokensBought; i++) {
			RAIR_ERC721 newToken = new RAIR_ERC721(string(userData), from, 30000);
			ownerToTokens[from].push(address(newToken));
			tokenToOwner[address(newToken)] = from;
		}
	}
}