// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

// Interfaces
//import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "../diamondStandard/interfaces/IDiamondLoupe.sol";

import './RAIR Token Facets/AppStorage.sol';

contract RAIR_ERC721_Diamond is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

	/**
	 * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
	 */
	constructor(string memory name_, address creatorAddress_, uint16 creatorRoyalty_) {
		s._name = name_;
		s._symbol = "RAIR";
		
		s.factoryAddress = msg.sender;
		s.royaltyFee = creatorRoyalty_;
		_setRoleAdmin(MINTER, CREATOR);
		_setRoleAdmin(TRADER, CREATOR);
		_grantRole(CREATOR, creatorAddress_);
		_grantRole(MINTER, creatorAddress_);
		_grantRole(TRADER, creatorAddress_);
	}

	function getFactoryAddress() public view returns (address) {
		return s.factoryAddress;
	}

	fallback() external {
		address facet = IDiamondLoupe(s.factoryAddress).facetAddress(msg.sig);
		assembly {
			// copy function selector and any arguments
			calldatacopy(0, 0, calldatasize())
			// execute function call using the facet
			let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
			// get any return value
			returndatacopy(0, 0, returndatasize())
			// return any return value or error back to the caller
			switch result
				case 0 {
					revert(0, returndatasize())
				}
				default {
					return(0, returndatasize())
				}
		}
	}
}