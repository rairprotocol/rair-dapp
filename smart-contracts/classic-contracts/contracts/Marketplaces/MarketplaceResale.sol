//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../Tokens/RAIR-ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

contract Resale_MarketPlace is ERC721Holder, AccessControl {
    event TradeStatusChange(
        address indexed operator,
        address tokenAddress,
        uint256 indexed itemId,
        uint256 indexed price,
        uint256 status,
        uint256 tradeid
    );
    event PriceChange(
        uint256 indexed itemId,
        uint256 oldPrice,
        uint256 newPrice
    );
    event ChangedTreasury(address newTreasury);
    event ChangedTreasuryFee(address treasury, uint16 newTreasuryFee);
    event ChangedNodeFee(uint16 newNodeFee);

    // price: wei
    // status: 1 => Open, 2 => Executed, 3 => Cancelled
    struct Trade {
        address payable poster;
        address tokenAddress;
        address payable creator;
        uint256 itemId;
        uint256 price;
        uint256 status;
    }

    struct TradeRoyaltyReceivers {
        address[] recipients;
        uint256[] percentages;
    }

    address public treasury;
    address public nodeAddress;

    //uint16 public constant feeDecimals = 3;

    uint16 public nodeFee = 1000;
    uint16 public treasuryFee = 9000;

    mapping(uint256 => Trade) private trades;
    mapping(uint256 => TradeRoyaltyReceivers) private royaltyReceivers;

    mapping(address => mapping(uint256 => bool)) tokenIdToSelling;

    uint256 private tradeCounter;
    uint256 private offerCounter;

    modifier OnlyTokenCreator(address tokenAddress) {
        RAIR_ERC721 itemToken = RAIR_ERC721(tokenAddress);
        require(tokenAddress != address(0), "Error: Invalid trade specified");
        require(
            itemToken.hasRole(itemToken.CREATOR(), msg.sender),
            "Error: Only token creator can set trade royalties"
        );
        _;
    }

    modifier OnlyItemOwner(address tokenAddress, uint256 tokenId) {
        RAIR_ERC721 itemToken = RAIR_ERC721(tokenAddress);
        require(
            itemToken.ownerOf(tokenId) == msg.sender,
            "Sender does not own the item"
        );
        _;
    }

    modifier HasTransferApproval(address tokenAddress, uint256 tokenId) {
        RAIR_ERC721 itemToken = RAIR_ERC721(tokenAddress);
        require(itemToken.getApproved(tokenId) == address(this));
        _;
    }

    constructor(address _treasury, address _nodeAddress) {
        tradeCounter = 0;
        treasury = _treasury;
        nodeAddress = _nodeAddress;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Get individual trade
    function getTrade(uint256 _trade) public view returns (Trade memory) {
        Trade memory trade = trades[_trade];
        return trade;
    }

    function onlyItemOwner(
        address tokenAddress,
        address addr,
        uint256 tokenId
    ) public view returns (bool) {
        RAIR_ERC721 itemToken = RAIR_ERC721(tokenAddress);
        return itemToken.ownerOf(tokenId) == addr;
    }

    function setTradeRoyaltyReceivers(
        uint256 trade,
        address[] calldata recipients,
        uint256[] calldata percentages
    ) external OnlyTokenCreator(trades[trade].tokenAddress) {
        require(
            recipients.length == percentages.length,
            "Error: Recipients and Percentages should have the same length"
        );
        require(trades[trade].status == 1, "Error: Trade status must be Open");

        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            total = total + percentages[i];
        }

        require(
            total == 100000,
            "Error: Percentages should add up to 100% (100000, including node fee and treasury fee)"
        );

        TradeRoyaltyReceivers storage trReceivers = royaltyReceivers[trade];
        trReceivers.recipients = recipients;
        trReceivers.percentages = percentages;
    }

    /* 
    List item in the market place for sale
    item unique id and amount of tokens to be put on sale price of item
    and an additional data parameter if you dont wan to pass data set it to empty string 
    if your sending the transaction through Frontend 
    else if you are send the transaction using etherscan or using nodejs set it to 0x00 
    */
    function openTrade(
        uint256 _itemId,
        uint256 _price,
        address tokenAddress
    )
        external
        OnlyItemOwner(tokenAddress, _itemId)
        HasTransferApproval(tokenAddress, _itemId)
    {
        require(
            tokenIdToSelling[tokenAddress][_itemId] == false,
            "Shouldn't create offers for a token that's already on sale"
        );

        RAIR_ERC721 itemToken = RAIR_ERC721(tokenAddress);

        address creator;
        uint256 royalty;
        (creator, royalty) = itemToken.royaltyInfo(_itemId, _price);

        itemToken.safeTransferFrom(
            payable(msg.sender),
            address(this),
            _itemId,
            "0x00"
        );

        trades[tradeCounter] = Trade({
            poster: payable(msg.sender),
            tokenAddress: tokenAddress,
            creator: payable(creator),
            itemId: _itemId,
            price: _price,
            status: 1
        });

        tradeCounter += 1;
        tokenIdToSelling[tokenAddress][_itemId] = true;

        emit TradeStatusChange(
            msg.sender,
            tokenAddress,
            _itemId,
            _price,
            1,
            tradeCounter - 1
        );
    }

    /*
    Buyer execute trade and pass the trade number
    and an additional data parameter if you dont wan to pass data set it to empty string 
    if your sending the transaction through Frontend 
    else if you are send the transaction using etherscan or using nodejs set it to 0x00 
    // 30% to creator's wallet <-- (this is the field that creators can edit when creating in the factory)
    // 60% to the seller
    // 9% to RAIR treasury wallet
    // 1% to the node's operator's wallet
    */
    function executeTrade(uint256 _trade) public payable {
        Trade memory trade = trades[_trade];

        require(trade.status == 1, "Error: Trade is not Open");
        require(
            msg.sender != address(0) && msg.sender != trade.poster,
            "Error: msg.sender is zero address or the owner is trying to buy his own nft"
        );
        require(msg.value >= trade.price, "Insuficient Funds!");

        RAIR_ERC721 itemToken = RAIR_ERC721(trade.tokenAddress);

        uint256 toNode = (trade.price * nodeFee) / 100000;
        uint256 toRAIR = (trade.price * treasuryFee) / 100000;

        address creator;
        uint256 royalty;
        (creator, royalty) = itemToken.royaltyInfo(trade.itemId, trade.price);
        require(
            trade.price - royalty >= toNode + toRAIR,
            "Insufficient Funds! Excessive Royalty"
        );

        TradeRoyaltyReceivers storage tradeRoyaltyReceivers = royaltyReceivers[
            _trade
        ];
        if (tradeRoyaltyReceivers.recipients.length > 0) {
            for (
                uint256 i = 0;
                i < tradeRoyaltyReceivers.recipients.length;
                i++
            ) {
                uint256 toReceiver = (royalty *
                    tradeRoyaltyReceivers.percentages[i]) / 100000;
                payable(tradeRoyaltyReceivers.recipients[i]).transfer(
                    toReceiver
                );
            }
        } else {
            payable(creator).transfer(royalty);
        }

        payable(nodeAddress).transfer(toNode);
        payable(treasury).transfer(toRAIR);

        uint256 toPoster = trade.price - royalty - toRAIR - toNode;
        payable(trade.poster).transfer(toPoster);

        // Pay the buyer any excess they transferred
        payable(msg.sender).transfer(msg.value - trade.price);

        itemToken.safeTransferFrom(
            address(this),
            payable(msg.sender),
            trade.itemId
        );

        trades[_trade].status = 2;
        tokenIdToSelling[trade.tokenAddress][trade.itemId] = false;

        emit TradeStatusChange(
            msg.sender,
            trade.tokenAddress,
            trade.itemId,
            msg.value,
            2,
            _trade
        );
    }

    /*
    Seller can cancle trade by passing the trade number
    and an additional data parameter if you dont wan to pass data set it to empty string 
    if your sending the transaction through Frontend 
    else if you are send the transaction using etherscan or using nodejs set it to 0x00 
    */

    function cancelTrade(uint256 _trade) public {
        Trade memory trade = trades[_trade];

        require(
            msg.sender == trade.poster,
            "Error: Trade can be cancelled only by poster"
        );
        require(trade.status == 1, "Error: Trade is not Open");

        IERC721 itemToken = IERC721(trade.tokenAddress);
        itemToken.safeTransferFrom(address(this), trade.poster, trade.itemId);

        trades[_trade].status = 3;
        delete royaltyReceivers[_trade];
        tokenIdToSelling[trade.tokenAddress][trade.itemId] = false;

        emit TradeStatusChange(
            msg.sender,
            trade.tokenAddress,
            trade.itemId,
            0,
            3,
            _trade
        );
    }

    // Get all items which are on sale in the market place
    function getAllOnSale() public view virtual returns (Trade[] memory) {
        uint256 counter = 0;
        uint256 itemCounter = 0;
        for (uint256 i = 0; i < tradeCounter; i++) {
            if (trades[i].status == 1) {
                counter++;
            }
        }

        Trade[] memory tokensOnSale = new Trade[](counter);
        if (counter != 0) {
            for (uint256 i = 0; i < tradeCounter; i++) {
                if (trades[i].status == 1) {
                    tokensOnSale[itemCounter] = trades[i];
                    itemCounter++;
                }
            }
        }

        return tokensOnSale;
    }

    // get all items owned by a perticular address
    function getAllByOwner(address owner) public view returns (Trade[] memory) {
        uint256 counter = 0;
        uint256 itemCounter = 0;
        for (uint256 i = 0; i < tradeCounter; i++) {
            if (trades[i].poster == owner) {
                counter++;
            }
        }

        Trade[] memory tokensByOwner = new Trade[](counter);
        if (counter != 0) {
            for (uint256 i = 0; i < tradeCounter; i++) {
                if (trades[i].poster == owner) {
                    tokensByOwner[itemCounter] = trades[i];
                    itemCounter++;
                }
            }
        }

        return tokensByOwner;
    }

    /*
    Seller can lowner the price of item by specifing trade number and new price
    if he wants to increase the price of item, he can unlist the item and then specify a higher price
    */
    function lowerTokenPrice(uint256 _trade, uint256 newPrice) public {
        require(
            msg.sender == trades[_trade].poster,
            "Error: Price can only be set by poster"
        );

        require(trades[_trade].status == 1, "Error: Trade is not Open");

        uint256 oldPrice = trades[_trade].price;
        require(
            newPrice < oldPrice,
            "Error: please specify a price value less than the old price if you want to increase the price, cancel the trade and list again  with a higher price"
        );
        trades[_trade].price = newPrice;
        emit PriceChange(_trade, oldPrice, newPrice);
    }

    function getTokenIdStatus(address tokenAddress, uint256 tokenId)
        public
        view
        returns (bool)
    {
        return tokenIdToSelling[tokenAddress][tokenId];
    }

    /// @notice	Sets the new treasury address
    /// @dev	Make sure the treasury is a wallet address!
    /// @dev	If the treasury is a contract, make sure it has a receive function!
    /// @param	_newTreasury	New address
    // function setTreasuryAddress(address _newTreasury) public onlyOwner {
    // 	treasury = _newTreasury;
    // 	emit ChangedTreasury(_newTreasury);
    // }

    /// @notice	Sets the new treasury fee
    // function setTreasuryFee(uint16 _newFee) public onlyOwner {
    // 	treasuryFee = _newFee;
    // 	emit ChangedTreasuryFee(treasury, _newFee);
    // }

    /// @notice Set the new treasury address
    /// @dev Make sure the treasury is a wallet address!
    /// @dev If the treasury is a contract, make sure it has a receive function
    /// @param _newTreasury New address
    function setTreasuryAddress(address _newTreasury)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_newTreasury != address(0), "invalid address");
        treasury = _newTreasury;
        emit ChangedTreasury(_newTreasury);
    }

    /// @notice Sets the new treasury fee
    /// @param _newFee New Fee
    function setTreasuryFee(uint16 _newFee)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        treasuryFee = _newFee;
        emit ChangedTreasuryFee(treasury, _newFee);
    }

    /// @notice Sets the new node address pair to nodes
    /// @param _newNodeAddress New node address
    function setNodeAddress(address _newNodeAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_newNodeAddress != address(0), "invalid address");
        nodeAddress = _newNodeAddress;
    }

    /// @notice Sets the new fee paid to nodes
    /// @param _newFee New Fee
    function setNodeFee(uint16 _newFee) public onlyRole(DEFAULT_ADMIN_ROLE) {
        nodeFee = _newFee;
        emit ChangedNodeFee(_newFee);
    }

    function withdraw(uint256 _amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(_amount);
    }
}