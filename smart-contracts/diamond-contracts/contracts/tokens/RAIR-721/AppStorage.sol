// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 

library ERC721Storage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.RAIR721');

    struct product {
        uint startingToken;
        uint endingToken;
        uint mintableTokens;
        string name;
        uint[] rangeList;
    }

    struct range {
        uint rangeStart;
        uint rangeEnd;
        uint tokensAllowed;
        uint mintableTokens;
        uint lockedTokens;
        uint rangePrice;
        string rangeName;
    }

    struct Layout {
        // Base ERC721
        string _name;
        string _symbol;
        mapping(uint256 tokenId => address) _owners;
        mapping(address owner => uint256) _balances;
        mapping(uint256 tokenId => address) _tokenApprovals;
        mapping(address owner => mapping(address operator => bool)) _operatorApprovals;
        // ERC721 enumerable extension
        mapping(address owner => mapping(uint256 index => uint256)) _ownedTokens;
        mapping(uint256 tokenId => uint256) _ownedTokensIndex;
        uint256[] _allTokens;
        mapping(uint256 tokenId => uint256) _allTokensIndex;
        // RAIR exclusive
        string baseURI;
        address factoryAddress;
        uint16 royaltyFee;
        product[] products;
        range[] ranges;
        mapping(uint => uint) tokenToProduct;
        mapping(uint => uint) tokenToRange;
        mapping(uint => string) uniqueTokenURI;
        mapping(uint => string) productURI;
        mapping(uint => bool) appendTokenIndexToProductURI;
        bool appendTokenIndexToBaseURI;
        mapping(uint => uint[]) tokensByProduct;
        string contractMetadataURI;
        mapping(uint => uint) rangeToProduct;
        mapping(uint => bool) _minted;
        // August 2022 - Metadata File Extension Update
        mapping(uint => string) rangeURI;
        mapping(uint => bool) appendTokenIndexToRangeURI;
        string _metadataExtension;
        // March 2024 - Optional trader role
        bool requiresTrader;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}