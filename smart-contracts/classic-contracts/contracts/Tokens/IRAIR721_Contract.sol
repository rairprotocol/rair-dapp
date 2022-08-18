// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import "openzeppelin-v4.7.1/token/ERC721/IERC721.sol";

interface IRAIR721_Contract is IERC721 {
    struct range {
        uint rangeStart;
        uint rangeEnd;
        uint tokensAllowed;
        uint mintableTokens;
        uint lockedTokens;
        uint rangePrice;
        string rangeName;
    }

    struct collection {
        uint startingToken;
        uint endingToken;
        string name;
        uint[] rangeList;
    }

    event CreatedCollection(
        uint indexed collectionIndex,
        string collectionName,
        uint startingToken,
        uint collectionLength
    );

    event CreatedRange(
        uint collectionIndex,
        uint start,
        uint end,
        uint price,
        uint tokensAllowed,
        uint lockedTokens,
        string name,
        uint rangeIndex
    );
    event UpdatedRange(
        uint rangeIndex,
        string name,
        uint price,
        uint tokensAllowed,
        uint lockedTokens
    );
    event TradingLocked(
        uint indexed rangeIndex,
        uint from,
        uint to,
        uint lockedTokens
    );
    event TradingUnlocked(uint indexed rangeIndex, uint from, uint to);

    event UpdatedBaseURI(string newURI, bool appendTokenIndex, string _metadataExtension);
    event UpdatedTokenURI(uint tokenId, string newURI);
    event UpdatedProductURI(
        uint productId,
        string newURI,
        bool appendTokenIndex,
        string _metadataExtension
    );
    event UpdatedRangeURI(
        uint rangeId,
        string newURI,
        bool appendTokenIndex,
        string _metadataExtension
    );
    event UpdatedURIExtension(string newExtension);
    event UpdatedContractURI(string newURI);

    // For OpenSea's Freezing
    event PermanentURI(string _value, uint256 indexed _id);

    // Get the total number of collections in the contract
    function getCollectionCount() external view returns (uint);

    // Get a specific collection in the contract
    function getCollection(uint collectionIndex)
        external
        view
        returns (collection memory);

    function rangeInfo(uint rangeIndex)
        external
        view
        returns (range memory data, uint collectionIndex);

    // Mint a token inside a collection
    function mintFromRange(
        address to,
        uint collectionID,
        uint index
    ) external;

    // Ask for the royalty info of the creator
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount);
}
