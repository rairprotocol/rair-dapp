// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

// Interfaces
//import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';

import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

import "../diamondStandard/interfaces/IDiamondLoupe.sol";

import './RAIR Token Facets/AppStorage.sol';

/// @title  RAIR 721 Diamond
/// @notice Diamond Contract implementing the bare minimum ERC-721 features
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721 & ERC165
contract RAIR_ERC721_Diamond is AccessControlAppStorageEnumerable721, ERC165 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	bytes32 public constant MINTER = keccak256("MINTER");
	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

	
	/// @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
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

	/// @notice This function allows us to know the factory address 
    /// @return address Contains the address of the factory contract
	function getFactoryAddress() public view returns (address) {
		return s.factoryAddress;
	}

	/// @notice This function allows us to know the URI of the contract 
    /// @return address Contains the string with all the URI, this string is saved in memory 
	function contractURI() public view returns (string memory) {
		return s.contractMetadataURI;
	}

	/// @notice This function allows us to know if and interface is suported
	/// @param 	interfaceId Contains the facet addresses and function selectors
	/// @return bool contains the value for the interface, it could be true or false
	function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
        	interfaceId == type(IERC721Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
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