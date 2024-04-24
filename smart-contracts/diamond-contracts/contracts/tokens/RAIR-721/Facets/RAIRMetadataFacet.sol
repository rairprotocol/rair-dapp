// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC721Storage} from "../AppStorage.sol";
import {ERC721AccessControlRoles} from "../AccessControlRoles.sol";
import {AccessControlEnumerable} from "../../../common/DiamondStorage/AccessControlEnumerable.sol";

/// @title  RAIR Metadata facet contract
/// @notice You can use this contract to administrate the metadata asociated to the Rair facet
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721
contract RAIRMetadataFacet is ERC721AccessControlRoles, AccessControlEnumerable {
	using Strings for uint256;

	/// @notice This event stores in the blockchain when the base code of all the tokens has an update in its URI
    /// @param  newURI 				Contains the new  base identifier for all the tokens
	/// @param  appendTokenIndex 	Contains the index of the tokens appended to the URI
	/// @param 	metadataExtension 	File extension (if exists)
	event UpdatedBaseURI(string newURI, bool appendTokenIndex, string metadataExtension);
	/// @notice This event stores in the blockchain when a token has a change in its URI
	/// @param  tokenId 			Contains the index of the token appended to the URI
    /// @param  newURI 				Contains the new identifier for the token
	event UpdatedTokenURI(uint tokenId, string newURI);
	/// @notice This event stores in the blockchain when a product has a change in its URI
	/// @param 	productId 			Contains the index of the product to change
    /// @param  newURI 				Contains the new identifier for the product
	/// @param  appendTokenIndex 	Contains the index of the token appended to the URI
	/// @param 	metadataExtension 	File extension (if exists)
	event UpdatedProductURI(uint productId, string newURI, bool appendTokenIndex, string metadataExtension);
	/// @notice This event stores in the blockchain when a range has a change in its URI
	/// @param 	rangeId 			Contains the index of the product to change
    /// @param  newURI 				Contains the new identifier for the product
	/// @param  appendTokenIndex 	Contains the index of the token appended to the URI
	/// @param 	metadataExtension 	File extension (if exists)
	event UpdatedRangeURI(uint rangeId, string newURI, bool appendTokenIndex, string metadataExtension);
	/// @notice This event stores in the blockchain when a contract has a change in its URI
    /// @param  newURI 				Contains the new identifier for the contract 
	event UpdatedContractURI(string newURI);
	/// @notice This event informs the new extension all metadata URIs will have appended at the end
	/// @dev 	It will be appended ONLY if the token ID has to also be appended
	/// @param 	newExtension The new extension for all the URIs
    event UpdatedURIExtension(string newExtension);


	// For OpenSea's Freezing
	event PermanentURI(string _value, uint256 indexed _id);

	/// @notice This function allows us to check if the token exist or not
	/// @param	tokenId	Contains the index of the token that we want to verify 
	/// @return bool Answer true if the token exist or false if not 
	function _exists(uint256 tokenId) internal view virtual returns (bool) {
		return ERC721Storage.layout()._owners[tokenId] != address(0);
	}

	/// @notice	Returns the token index inside the product
	/// @param	token	Token ID to find
	/// @return tokenIndex which contains the corresponding token index
	function tokenToCollectionIndex(uint token) public view returns (uint tokenIndex) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		return token - store.products[store.tokenToProduct[token]].startingToken;
	}

	/// @notice	Updates the unique URI of all the tokens, but in a single transaction
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Uses the single function so it also emits an event
	/// @dev 	This function requires that all the tokens have a corresponding URI
	/// @param	tokenIds	Token Indexes that will be given an URI
	/// @param	newURIs		New URIs to be set
	function setUniqueURIBatch(uint[] calldata tokenIds, string[] calldata newURIs) external onlyRole(CREATOR) {
		require(
			tokenIds.length == newURIs.length,
			"RAIR ERC721: Token IDs and URIs should have the same length"
		);
		for (uint i = 0; i < tokenIds.length; i++) {
			setUniqueURI(tokenIds[i], newURIs[i]);
		}
	}
	
	/// @notice	Gives an individual token an unique URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Emits an event so there's provenance
	/// @param	tokenId	Token Index that will be given an URI
	/// @param	newURI	New URI to be given
	function setUniqueURI(uint tokenId, string calldata newURI) public onlyRole(CREATOR) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		store.uniqueTokenURI[tokenId] = newURI;
		emit UpdatedTokenURI(tokenId, newURI);
	}

	/// @notice  Updates the metadata extension added at the end of all tokens
    /// @dev     Must include the . before the extension
    /// @param extension     Extension to be added at the end of all contract wide tokens
    function setMetadataExtension(string calldata extension) external onlyRole(CREATOR) {
        require(
			bytes(extension)[0] == '.',
			"RAIR ERC721: Extension must start with a '.'"
		);
		ERC721Storage.Layout storage store = ERC721Storage.layout();
        store._metadataExtension = extension;
        emit UpdatedURIExtension(store._metadataExtension);
    }

	/// @notice	Gives all tokens within a range a specific URI
    /// @dev	Emits an event so there's provenance
    /// @param	rangeId				Token Index that will be given an URI
    /// @param	newURI		    	New URI to be given
    /// @param	appendTokenIndex	Flag to append the token index at the end of the new URI
    function setRangeURI(
        uint rangeId,
        string calldata newURI,
        bool appendTokenIndex
    ) public onlyRole(CREATOR) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
        store.rangeURI[rangeId] = newURI;
        store.appendTokenIndexToRangeURI[rangeId] = appendTokenIndex;
        emit UpdatedRangeURI(rangeId, newURI, appendTokenIndex, store._metadataExtension);
    }

	/// @notice	Gives an individual token an unique URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Emits an event so there's provenance
	/// @param	productId						Token Index that will be given an URI
	/// @param	newURI							New URI to be given
	/// @param	appendTokenIndexToProductURI 	If true, it will append the token index to the URI
	function setCollectionURI(uint productId, string calldata newURI, bool appendTokenIndexToProductURI) public onlyRole(CREATOR) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		store.productURI[productId] = newURI;
		store.appendTokenIndexToProductURI[productId] = appendTokenIndexToProductURI;
		emit UpdatedProductURI(
			productId,
			newURI,
			appendTokenIndexToProductURI,
			store._metadataExtension
		);
	}

	/// @notice	This function use OpenSea's to freeze the metadata
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param tokenId Token Index that will be given an URI
	function freezeMetadata(uint tokenId) public onlyRole(CREATOR) {
		emit PermanentURI(tokenURI(tokenId), tokenId);
	}

	/// @notice	This function allow us to set a new contract URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param newURI New URI to be given
	function setContractURI(string calldata newURI) external onlyRole(CREATOR) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		store.contractMetadataURI = newURI;
		emit UpdatedContractURI(newURI);
	}

	/// @notice	This function allow us to see the current URI of the contract
	/// @return string with the URI of the contract 
	function contractURI() public view returns (string memory) {
		return ERC721Storage.layout().contractMetadataURI;
	}
	
	/// @notice	Sets the Base URI for ALL tokens
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Can be overriden by the specific token URI
	/// @param	newURI	URI to be used
	/// @param	appendTokenIndexToBaseURI	URI to be used
	function setBaseURI(string calldata newURI, bool appendTokenIndexToBaseURI) external onlyRole(CREATOR) {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
		store.baseURI = newURI;
		store.appendTokenIndexToBaseURI = appendTokenIndexToBaseURI;
		emit UpdatedBaseURI(newURI, appendTokenIndexToBaseURI, store._metadataExtension);
	}

	/// @notice	Returns a token's URI
    /// @dev	Will return unique token URI or product URI or contract URI
    /// @param	tokenId		Token Index to look for
	/// @return string with the URI of the toke that we are using
    function tokenURI(uint tokenId)
        public
        view
        returns (string memory)
    {
		ERC721Storage.Layout storage store = ERC721Storage.layout();
        // Unique token URI
        string memory URI = store.uniqueTokenURI[tokenId];
        if (bytes(URI).length > 0) {
            return URI;
        }

        // Range wide URI
        URI = store.rangeURI[store.tokenToRange[tokenId]];
        if (bytes(URI).length > 0) {
            if (store.appendTokenIndexToRangeURI[store.tokenToRange[tokenId]]) {
                return
					string.concat(
						URI,
						tokenToCollectionIndex(tokenId).toString(),
						store._metadataExtension
                    );
            }
            return URI;
        }

        // Collection wide URI
        URI = store.productURI[store.tokenToProduct[tokenId]];
        if (bytes(URI).length > 0) {
            if (store.appendTokenIndexToProductURI[store.tokenToProduct[tokenId]]) {
                return
                    string.concat(
						URI,
						tokenToCollectionIndex(tokenId).toString(),
						store._metadataExtension
                    );
            }
            return URI;
        }

        URI = store.baseURI;
        if (store.appendTokenIndexToBaseURI) {
            return
                string.concat(
					URI,
					tokenId.toString(),
					store._metadataExtension
                );
        }
        return URI;
    }
}