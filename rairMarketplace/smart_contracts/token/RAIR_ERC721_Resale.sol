// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/math/utils/SafeMath.sol";

import "../interfaces/IRAIR_ERC721_ResaleCreater.sol";
import "../interfaces/IRAIR_ERC721_ResaleAccessControls.sol";
import "../contracts/MarketplaceResale_RairTreasuryFundsSplitter.sol";

contract RAIR_ERC721_Resale is IRAIR_ERC721_ResaleCreater {
    using SafeMath for uint256;

    IRAIR_ERC721_ResaleAccessControls public accessControls;
    MarketplaceResale_RairTreasuryFundsSplitter public rairTreasuryFundsSplitter;

    event CollectionMinted(address indexed _contractAddress,uint256 indexed _tokenID);

    struct Collection {
        uint256 copies;
        uint256 creationDate;
        uint256 license;
        uint256 price;
        uint256 royalty;
        uint256 title;
        address contractAddress;
    }

    uint256 public tokenIdPointer = 0;
    uint256 public transfersEnabledFrom;

    mapping (uint256 => Collection) internal Collections;

    modifier isWhitelisted() {
        require(accessControls.isWhitelisted(msg.sender), "Caller not whitelisted");
        _;
    }

    modifier onlyWhenTokenExists(uint256 _tokenId) {
        require(_exists(_tokenId), "Token not found for ID");
        _;
    }

    constructor (
        IRAIR_ERC721_ResaleAccessControls _accessControls,
        uint256 _transferEnabledFrom,
        MarketplaceResale_RairTreasuryFundsSplitter _rairTreasuryFundsSplitter
    ) public ERC721("RAIR.Tech","RAIR") {
        accessControls = _accessControls;
        transfersEnabledFrom = _transferEnabledFrom;
        rairTreasuryFundsSplitter = _rairTreasuryFundsSplitter;
    }

    function createResale(
        uint256 _copies, 
        uint256 _creationDate,
        uint256 _price,
        uint256 _royalty,
        uint256 _title,
        address _contractAddress
    ) external isWhitelisted returns (uint256 _tokenId) {
        tokenIdPointer = tokenIdPointer.add(1);
        uint256 tokenId = tokenIdPointer;
        
        // Create Collection metadata
        Collections[tokenId] = Collection({
            copies: _copies,
            creationDate: _creationDate,
            price: _price,
            royalty: _royalty,
            title: _title
        });

        _mint(_contractAddress, tokenId);

        emit CollectionMinted(_contractAddress, tokenId);

        return tokenId;
    }

    function attributes(uint256 _tokenId) external onlyWhenTokenExists(_tokenId) view returns (
        uint256 _copies,
        uint256 _creationDate,
        uint256 _price,
        uint256 _royalty,
        uint256 _title
    ) {
        Collection storage collection = collections[_tokenId];
        return (
            collection.copies,
            collection.creationDate,
            collection.price,
            collection.royalty,
            collection.title
        );
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

    function transferFrom(address payable from, address to, uint256 tokenId) public payable {
        require(now > transfersEnabledFrom, "Transfers are currently disabled");

        super.transferFrom(from, to, tokenId);

        if (msg.value > 0) {
            uint256 singleUnitOfValue = msg.value.div(100);

            // 30% creator
            uint256 creatorTreasurySplit = singleUnitOfValue.mul(30);
            _sendValueToTokenCreators(creatorTreasurySplit);

            // 9% rair
            uint256 rairTreasuryFundsSplit = singleUnitOfValue.mul(9);
            (bool fsSuccess, ) = address(rairTreasuryFundsSplitter).call.value(rairTreasuryFundsSplit)("");
            require(fsSuccess, "Failed to send funds to the treasury");

            // 1% nodeFee 
            uint256 nodeFeeTreasurySplit = singleUnitOfValue.mul(1);
            (bool fromSuccess, ) = from.call.value(nodeFeeTreasurySplit)("");
            require(fromSuccess, "Failed to send nodeFee to the treasury");

            // 60% seller
            uint256 sellersTreasurySplit = singleUnitOfValue.mul(60);
            (bool fromSuccess, ) = from.call.value(sellersTreasurySplit)("");
            require(fromSuccess, "Failed to send funds to the seller");
        }
    }

    function updateTransfersEnabledFrom(uint256 _transfersEnabledFrom) external isWhitelisted {
        transfersEnabledFrom = _transfersEnabledFrom;
    }

    function updateRairTreasuryFundsSplitter(MarketplaceResale_RairTreasuryFundsSplitter _rairTreasuryFundsSplitter) external isWhitelisted {
        rairTreasuryFundsSplitter = _rairTreasuryFundsSplitter;
    }

    function _sendValueToTokenHolders(uint256 _value) private {
        uint256 individualTokenCreatorSplit = _value.div(tokenIdPointer);
        for(uint i=1; i <= tokenIdPointer; i++) {
            address payable owner = address(uint160(super.ownerOf(i)));
            (bool ownerSuccess, ) = owner.call.value(individualTokenCreatorSplit)("");
            require(ownerSuccess, "Failed to send funds to a Resale token owner");
        }
    }

}