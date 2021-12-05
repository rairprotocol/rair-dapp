// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import '../AppStorage.sol';
import '../../tokens/RAIR-ERC721.sol';

contract ERC777ReceiverFacet is IERC777Recipient, AccessControlAppStorageEnumerable {
	bytes32 constant ERC777 = keccak256("ERC777");
	
	event NewContractDeployed(address owner, uint id, address token, string contractName);
	
	/// @notice Function called by an ERC777 when they send tokens
	/// @dev    This is our deployment mechanism for ERC721 contracts!
	/// @param operator		The ERC777 operator calling the send() function
	/// @param from			The owner of the tokens
	/// @param to			The recipient of the tokens
	/// @param amount		The number of tokens sent
	/// @param userData		bytes sent from the send call
	/// @param operatorData	bytes sent from the operator
	function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata userData, bytes calldata operatorData) external onlyRole(ERC777) override {
		AppStorage storage s = LibAppStorage.diamondStorage();
		require(amount >= s.deploymentCostForERC777[msg.sender], 'RAIR Factory: not enough RAIR tokens to deploy a contract');

		if (amount - (s.deploymentCostForERC777[msg.sender]) > 0) {
			IERC777(msg.sender).send(from, amount - (s.deploymentCostForERC777[msg.sender]), userData);
		}
		address[] storage tokensFromOwner = s.ownerToContracts[from];
		
		if (tokensFromOwner.length == 0) {
			s.creators.push(from);
		}

		RAIR_ERC721 newToken = new RAIR_ERC721(string(userData), from, 30000);
		tokensFromOwner.push(address(newToken));
		s.contractToOwner[address(newToken)] = from;
		emit NewContractDeployed(from, tokensFromOwner.length, address(newToken), string(userData));
	}

	function zaboomaFoo() onlyRole(ERC777) view public returns (bool) {
		return true;
	}
}