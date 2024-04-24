// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

// Interfaces
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Metadata} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {IERC721Enumerable} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import {ERC165} from '@openzeppelin/contracts/utils/introspection/ERC165.sol';

import {IDiamondLoupe} from "../../diamondStandard/interfaces/IDiamondLoupe.sol";
import {ERC721Storage} from "./AppStorage.sol";
import {ERC721AccessControlRoles} from "./AccessControlRoles.sol";
import {AccessControlEnumerable} from "../../common/DiamondStorage/AccessControlEnumerable.sol";

interface Factory {
	function getFacetSource() view external returns(address);
}

/// @title  RAIR ERC721 Diamond
/// @dev 	Fallback will get the facets from the factory
/// @author Juan M. Sanchez M.
contract RAIR721_Diamond is ERC721AccessControlRoles, ERC165, AccessControlEnumerable {
	
	constructor(
        string memory name_,
        string memory symbol,
        address creatorAddress_,
        uint16 creatorRoyalty_
    ) {
        ERC721Storage.Layout storage store = ERC721Storage.layout();

		store._name = name_;
		store._symbol = symbol;

        store.requiresTrader = true;
		store.factoryAddress = msg.sender;

		store.royaltyFee = creatorRoyalty_;
		_setRoleAdmin(MINTER, CREATOR);
		_setRoleAdmin(TRADER, CREATOR);
		_grantRole(CREATOR, creatorAddress_);
		_grantRole(MINTER, creatorAddress_);
		_grantRole(TRADER, creatorAddress_);
	}

	/// @notice Returns the address from where the contract was created
    /// @return factoryAddress Address of the factory
	function getFactoryAddress() public view returns (address factoryAddress) {
        factoryAddress = ERC721Storage.layout().factoryAddress;
	}

	/// @notice This function allows us to know the URI of the contract 
    /// @return contractMetadataURI Contains the string with all the URI, this string is saved in memory 
	function contractURI() public view returns (string memory contractMetadataURI) {
        contractMetadataURI = ERC721Storage.layout().contractMetadataURI;
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
        Factory factory = Factory(ERC721Storage.layout().factoryAddress);
		address facet = IDiamondLoupe(factory.getFacetSource()).facetAddress(msg.sig);
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