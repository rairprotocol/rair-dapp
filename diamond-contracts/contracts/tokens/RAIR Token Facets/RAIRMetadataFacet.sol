// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import './AppStorage.sol';

contract RAIRMetadataFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	using Strings for uint256;

	event BaseURIChanged(string newURI, bool appendTokenIndex);
	event TokenURIChanged(uint tokenId, string newURI);
	event ProductURIChanged(uint productId, string newURI, bool appendTokenIndex);
	event ContractURIChanged(string newURI);

	// For OpenSea's Freezing
	event PermanentURI(string _value, uint256 indexed _id);

	function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return s._owners[tokenId] != address(0);
    }

	/// @notice	Returns the token index inside the product
	/// @param	token	Token ID to find
	function tokenToProductIndex(uint token) public view returns (uint tokenIndex) {
		return token - s.products[s.tokenToProduct[token]].startingToken;
	}

	/// @notice	Updates the unique URI of a token, but in a single transaction
	/// @dev	Uses the single function so it also emits an event
	/// @param	tokenIds	Token Indexes that will be given an URI
	/// @param	newURIs		New URIs to be set
	function setUniqueURIBatch(uint[] calldata tokenIds, string[] calldata newURIs) external onlyRole(CREATOR) {
		require(tokenIds.length == newURIs.length, "RAIR ERC721: Token IDs and URIs should have the same length");
		for (uint i = 0; i < tokenIds.length; i++) {
			setUniqueURI(tokenIds[i], newURIs[i]);
		}
	}
	
	/// @notice	Gives an individual token an unique URI
	/// @dev	Emits an event so there's provenance
	/// @param	tokenId	Token Index that will be given an URI
	/// @param	newURI	New URI to be given
	function setUniqueURI(uint tokenId, string calldata newURI) public onlyRole(CREATOR) {
		s.uniqueTokenURI[tokenId] = newURI;
		emit TokenURIChanged(tokenId, newURI);
	}

	/// @notice	Gives an individual token an unique URI
	/// @dev	Emits an event so there's provenance
	/// @param	productId	Token Index that will be given an URI
	/// @param	newURI		New URI to be given
	function setProductURI(uint productId, string calldata newURI, bool appendTokenIndexToProductURI) public onlyRole(CREATOR) {
		s.productURI[productId] = newURI;
		s.appendTokenIndexToProductURI[productId] = appendTokenIndexToProductURI;
		emit ProductURIChanged(productId, newURI, appendTokenIndexToProductURI);
	}

	function freezeMetadata(uint tokenId) public onlyRole(CREATOR) {
		emit PermanentURI(tokenURI(tokenId), tokenId);
	}

	function setContractURI(string calldata newURI) external onlyRole(CREATOR) {
		s.contractMetadataURI = newURI;
		emit ContractURIChanged(newURI);
	}

	function contractURI() public view returns (string memory) {
		return s.contractMetadataURI;
    }
	
	/// @notice	Sets the Base URI for ALL tokens
	/// @dev	Can be overriden by the specific token URI
	/// @param	newURI	URI to be used
	function setBaseURI(string calldata newURI, bool appendTokenIndexToBaseURI) external onlyRole(CREATOR) {
		s.baseURI = newURI;
		s.appendTokenIndexToBaseURI = appendTokenIndexToBaseURI;
		emit BaseURIChanged(newURI, appendTokenIndexToBaseURI);
	}

	/// @notice	Returns a token's URI, could be specific or general
	/// @dev	IF the specific token URI doesn't exist, the general base URI will be returned
	/// @param	tokenId		Token Index to look for
	function tokenURI(uint tokenId) public view returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
		string memory URI = s.uniqueTokenURI[tokenId];
		if (bytes(URI).length > 0) {
			return URI;
		}
		URI = s.productURI[s.tokenToProduct[tokenId]];
		if (bytes(URI).length > 0) {
			if (s.appendTokenIndexToProductURI[s.tokenToProduct[tokenId]]) {
				return string(abi.encodePacked(URI, tokenToProductIndex(tokenId).toString()));
			}
			return URI; 
		}
		URI = s.baseURI;
		if (bytes(URI).length > 0) {
	        if (s.appendTokenIndexToBaseURI) {
				return string(abi.encodePacked(URI, tokenId.toString()));
			}
			return URI;
		}
        return "";
	}
}