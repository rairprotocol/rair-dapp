// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17; 

// Used on interfaces
import '@openzeppelin/contracts/access/AccessControl.sol';
import "../Tokens/IRAIR-ERC721.sol";
import "../Tokens/IERC2981.sol";

// Parent classes
import '@openzeppelin/contracts/access/Ownable.sol';

/// @title  Minter Marketplace 
/// @notice Handles the minting of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the minting mechanisms on other tokens!
contract Minter_Marketplace is Ownable {
	struct offer {
		address contractAddress;
		address nodeAddress;
		uint productIndex;
		uint[] tokenRangeStart;
		uint[] tokenRangeEnd;
		uint[] tokensAllowed;
		uint[] rangePrice;
		string[] rangeName;
	}

	// Auxiliary struct used to avoid "stack too deep" errors
	struct productInfo {
		uint start;
		uint end;
		uint mintableTokens;
	}

	struct customPayment {
		address[] recipients;
		uint[] percentages;
	}

	uint16 public constant feeDecimals = 3;

	mapping(address => mapping(uint => uint)) internal _contractToOffers;
	mapping(uint => customPayment) internal customPayments;

	offer[] public offerCatalog;

	address public treasury;
	uint public openSales;
	uint16 public treasuryFee;
	uint16 public nodeFee;

	event AddedOffer(address contractAddress, uint productIndex, uint rangesCreated, uint catalogIndex);
	event UpdatedOffer(address contractAddress, uint offerIndex, uint rangeIndex, uint tokens, uint price, string name);
	event AppendedRange(address contractAddress, uint productIndex, uint offerIndex, uint rangeIndex,  uint startToken, uint endToken, uint price, string name);
	event TokenMinted(address ownerAddress, address contractAddress, uint catalogIndex, uint rangeIndex, uint tokenIndex);
	event SoldOut(address contractAddress, uint catalogIndex, uint rangeIndex);
	event CustomPaymentSet(uint catalogIndex, address[] recipients, uint[] percentages);
	event ChangedTreasury(address newTreasury);
	event ChangedTreasuryFee(address treasury, uint16 newTreasuryFee);
	event ChangedNodeFee(uint16 newNodeFee);

	/// @notice	Constructor
	/// @dev	Should start up with the treasury, node and treasury fee
	/// @param	_treasury		The address of the Treasury
	/// @param	_treasuryFee	Fee given to the treasury every sale (Recommended default: 9%)
	/// @param	_nodeFee		Fee given to the node on every sale (Recommended default: 1%)
	constructor(address _treasury, uint16 _treasuryFee, uint16 _nodeFee) {
		treasury = _treasury;
		treasuryFee = _treasuryFee;
		nodeFee = _nodeFee;
		openSales = 0;
	}

	function setCustomPayment(uint catalogIndex, address[] calldata recipients, uint[] calldata percentages) external {
		require(recipients.length == percentages.length, "Minting Marketplace: Recipients and Percentages should have the same length");
		require(offerCatalog.length > 0, "Minting Marketplace: There are no offer pools");
		require(catalogIndex <= offerCatalog.length, "Minting Marketplace: Offer Pool doesn't exist");
		require(offerCatalog[catalogIndex].contractAddress != address(0), "Minting Marketplace: Invalid offer pool data");
		validateRoles(offerCatalog[catalogIndex].contractAddress);
		uint total = 0;
		for (uint i = 0; i < recipients.length; i++) {
			total = total + percentages[i];
		}
		require(total + treasuryFee + nodeFee == 100000, "Minting Marketplace: Percentages should add up to 100% (100000, including node fee and treasury fee)");
		customPayment storage aux = customPayments[catalogIndex];
		aux.recipients = recipients;
		aux.percentages = percentages;
		emit CustomPaymentSet(catalogIndex, recipients, percentages);
	}

	/// @notice	View function that returns the offer given a contract address and a product index
	/// @param	erc721Address	Address of the RAIR Token contract
	/// @param	productIndex	Index of the product
	/// @param	offerIndex		Index of the offer with all the ranges
	function contractToOfferRange(address erc721Address, uint productIndex) public view returns (uint offerIndex) {
		require(offerCatalog.length > 0, "Minting Marketplace: There are no offers registered");
		require(offerCatalog[(_contractToOffers[erc721Address][productIndex])].contractAddress == erc721Address, "Minting Marketplace: There are no offers registered for that address");
		require(offerCatalog[(_contractToOffers[erc721Address][productIndex])].productIndex == productIndex, "Minting Marketplace: There are is no offer registered for that product");
		return (_contractToOffers[erc721Address][productIndex]);
	}

	/// @notice	Sets the new treasury address
	/// @dev	Make sure the treasury is a wallet address!
	/// @dev	If the treasury is a contract, make sure it has a receive function!
	/// @param	_newTreasury	New address
	function setTreasuryAddress(address _newTreasury) public onlyOwner {
		treasury = _newTreasury;
		emit ChangedTreasury(_newTreasury);
	}

	/// @notice	Sets the new treasury fee
	/// @param	_newFee	New Fee
	function setTreasuryFee(uint16 _newFee) public onlyOwner {
		treasuryFee = _newFee;
		emit ChangedTreasuryFee(treasury, _newFee);
	}

	/// @notice	Sets the new fee paid to nodes
	/// @param	_newFee	New Fee
	function setNodeFee(uint16 _newFee) public onlyOwner {
		nodeFee = _newFee;
		emit ChangedNodeFee(_newFee);
	}

	/// @notice	Returns the number of collections on the market
	/// @dev	Includes completed collections though
	function getOfferCount() public view returns(uint) {
		return offerCatalog.length;
	}

	/// @notice	Returns the basic information about an offer
	/// @dev	Translates the internal offer schema to individual values
	/// @param	_index		Index of the offer in this contract
	function getOfferInfo(uint _index) public view returns(address contractAddress, uint productIndex, address nodeAddress, uint availableRanges) {
		offer memory selectedOffer = offerCatalog[_index];
		return (
			selectedOffer.contractAddress,
			selectedOffer.productIndex,
			selectedOffer.nodeAddress,
			selectedOffer.rangeName.length
		);
	}

	/// @notice	Returns the information about an offer's range
	/// @dev	Translates the internal offer schema to individual values
	/// @param	offerIndex		Index of the offer in this contract
	/// @param	rangeIndex		Index of the range inside the contract
	function getOfferRangeInfo(uint offerIndex, uint rangeIndex) public view returns(
		address contractAddress,
		uint collectionIndex,
		uint tokenStart,
		uint tokenEnd,
		uint tokensAllowed,
		uint price,
		string memory name) {
		offer memory selectedOffer = offerCatalog[offerIndex];
		return (selectedOffer.contractAddress,
			selectedOffer.productIndex,
			selectedOffer.tokenRangeStart[rangeIndex],
			selectedOffer.tokenRangeEnd[rangeIndex],
			selectedOffer.tokensAllowed[rangeIndex],
			selectedOffer.rangePrice[rangeIndex],
			selectedOffer.rangeName[rangeIndex]);
	}

	/// @notice Makes sure the starting and ending tokens are correct
	/// @param	start 	Starting token
	/// @param	end 	Ending token
	function _validateRangeInfo(uint start, uint end, uint parentStart, uint parentEnd) internal pure {
		require(start <= end, "Minting Marketplace: Range's starting token has to be less than the range's ending token!");
		require((parentStart + end) <= parentEnd, "Minting Marketplace: Range's ending token has to be less or equal than the product's ending token!");
	}

	/// @notice Validates that the Minter Marketplace and the message sender have the correct roles inside the ERC721
	/// @dev	Doubles as a view function for anyone wondering if they can mint or if they need to approve the marketplace
	/// @param	tokenAddress 	Address of the token to validate
	function validateRoles(address tokenAddress) public view returns (bool canOffer) {
		require(tokenAddress != address(0), "Minting Marketplace: Invalid token address");
		require(IAccessControl(tokenAddress).hasRole(bytes32(keccak256("MINTER")), address(this)), "Minting Marketplace: This Marketplace isn't a Minter!");
		require(IAccessControl(tokenAddress).hasRole(bytes32(keccak256("CREATOR")), address(msg.sender)), "Minting Marketplace: Sender isn't the creator!");
		return true;
	}

	/// @notice Inserts a range inside the offer
	/// @param	offerIndex 	Index of the offer to append ranges to
	/// @param	startToken 	Starting token
	/// @param	endToken 	Ending token
	/// @param	price 		Price of that specific range
	/// @param	name 	 	Name of the range
	function _appendOfferRange(
		uint offerIndex,
		uint startToken,
		uint endToken,
		uint price,
		string memory name
	) internal {
		offer storage selectedOffer = offerCatalog[offerIndex];
		selectedOffer.tokenRangeStart.push(startToken);
		selectedOffer.tokenRangeEnd.push(endToken);
		selectedOffer.rangePrice.push(price);
		selectedOffer.tokensAllowed.push((endToken - startToken) + 1);
		selectedOffer.rangeName.push(name);
		emit AppendedRange(
			selectedOffer.contractAddress,
			selectedOffer.productIndex,
			offerIndex,
			selectedOffer.rangeName.length - 1,
			startToken,
			endToken,
			price,
			name);
		openSales++;
	}

	/// @notice	Adds an offer to the market's catalog
	/// @dev	It validates that the collection has mintable tokens left
	/// @dev	It validates that the number of tokens allowed to sell is less or equal than the number of mintable tokens
	/// @param	_tokenAddress		Address of the ERC721
	/// @param	_productIndex		Index of the collection inside the ERC721
	/// @param	_rangeStartToken	Starting token inside the ERC721 (for each range)
	/// @param	_rangeEndToken		Ending token inside the ERC721 (for each range)
	/// @param	_rangePrice			Price of each range (for each range)
	/// @param	_rangeName			Name (for each range)
	/// @param	_nodeAddress		Address of the node to be paid
	function addOffer(
		address _tokenAddress,
		uint _productIndex,
		uint[] calldata _rangeStartToken,
		uint[] calldata _rangeEndToken,
		uint[] calldata _rangePrice,
		string[] calldata _rangeName,
		address _nodeAddress)
	external {
		validateRoles(_tokenAddress);
		require(_rangeStartToken.length == _rangeEndToken.length &&
					_rangePrice.length == _rangeStartToken.length &&
					_rangeName.length == _rangePrice.length, "Minting Marketplace: Offer's ranges should have the same length!");

		if (offerCatalog.length > 0) {
			if (_contractToOffers[_tokenAddress][_productIndex] == 0) {
				require(offerCatalog[_contractToOffers[_tokenAddress][_productIndex]].contractAddress != _tokenAddress ||
							offerCatalog[_contractToOffers[_tokenAddress][_productIndex]].productIndex != _productIndex,
								"Minting Marketplace: An offer already exists for this contract and product");
			} else {
				require(_contractToOffers[_tokenAddress][_productIndex] == 0, "Minting Marketplace: An offer already exists for this contract and product");
			}
		}

		productInfo memory aux;
		
		(aux.start, aux.end, aux.mintableTokens,,) = IRAIR_ERC721(_tokenAddress).getProduct(_productIndex);
		require(aux.mintableTokens > 0, "Minting Marketplace: Cannot mint more tokens from this Product!");
		
		offer storage newOffer = offerCatalog.push();

		newOffer.contractAddress = _tokenAddress;
		newOffer.nodeAddress = _nodeAddress;
		newOffer.productIndex = _productIndex;

		for (uint i = 0; i < _rangeName.length; i++) {
			_validateRangeInfo(_rangeStartToken[i], _rangeEndToken[i], aux.start, aux.end);
			_appendOfferRange(
				offerCatalog.length - 1,
				_rangeStartToken[i],
				_rangeEndToken[i],
				_rangePrice[i],
				_rangeName[i]
			);
		}
		_contractToOffers[_tokenAddress][_productIndex] = offerCatalog.length - 1;
		emit AddedOffer(_tokenAddress, _productIndex, _rangeName.length, offerCatalog.length - 1);
	}

	function updateOfferRange(
		uint offerIndex,
		uint rangeIndex,
		uint startToken,
		uint endToken,
		uint price,
		string calldata name
	) external {
		offer storage selectedOffer = offerCatalog[offerIndex];
		require(endToken <= selectedOffer.tokenRangeEnd[rangeIndex] &&
					startToken >= selectedOffer.tokenRangeStart[rangeIndex],
						'Minting Marketplace: New limits must be within the previous limits!');
		validateRoles(selectedOffer.contractAddress);
		
		productInfo memory aux;
		(aux.start, aux.end,,,) = IRAIR_ERC721(selectedOffer.contractAddress).getProduct(selectedOffer.productIndex);
		_validateRangeInfo(startToken, endToken, aux.start, aux.end);
		selectedOffer.tokensAllowed[rangeIndex] -= (selectedOffer.tokenRangeEnd[rangeIndex] - selectedOffer.tokenRangeStart[rangeIndex]) - (endToken - startToken);
		selectedOffer.tokenRangeStart[rangeIndex] = startToken;
		selectedOffer.tokenRangeEnd[rangeIndex] = endToken;
		selectedOffer.rangePrice[rangeIndex] = price;
		selectedOffer.rangeName[rangeIndex] = name;
		emit UpdatedOffer(selectedOffer.contractAddress, offerIndex, rangeIndex, selectedOffer.tokensAllowed[rangeIndex], price, name);
	}

	function appendOfferRange(
		uint offerIndex,
		uint startToken,
		uint endToken,
		uint price,
		string calldata name
	) public {
		validateRoles(offerCatalog[offerIndex].contractAddress);
		productInfo memory aux;
		(aux.start, aux.end,,,) = IRAIR_ERC721(offerCatalog[offerIndex].contractAddress).getProduct(offerCatalog[offerIndex].productIndex);
		_validateRangeInfo(startToken, endToken, aux.start, aux.end);
		_appendOfferRange(
			offerIndex,
			startToken,
			endToken,
			price,
			name
		);
	}

	function appendOfferRangeBatch(
		uint offerIndex,
		uint[] memory startTokens,
		uint[] memory endTokens,
		uint[] memory prices,
		string[] memory names
	) public {
		require(startTokens.length == endTokens.length &&
					prices.length == startTokens.length &&
					names.length == prices.length, "Minting Marketplace: Offer's ranges should have the same length!");
		validateRoles(offerCatalog[offerIndex].contractAddress);
		productInfo memory aux;
		(aux.start, aux.end,,,) = IRAIR_ERC721(offerCatalog[offerIndex].contractAddress).getProduct(offerCatalog[offerIndex].productIndex);
		for (uint i = 0; i < names.length; i++) {
			_validateRangeInfo(startTokens[i], endTokens[i], aux.start, aux.end);
			_appendOfferRange(
				offerIndex,
				startTokens[i],
				endTokens[i],
				prices[i],
				names[i]
			);
		}
	}
	
	/// @notice	Receives funds and mints a new token for the sender
	/// @dev	It validates that the Marketplace is still a minter
	/// @dev	It splits the funds in 3 ways
	/// @dev	It validates that the ERC721 token supports the interface for royalties and only then, it will give the funds to the creator
	/// @dev	If the ERC721 collection doesn't have any mintable tokens left, it will revert using the ERC721 error, not in the marketplace!
	/// @param	catalogIndex		Index of the sale within the catalog
	/// @param	rangeIndex			Index of the range within the offer
	/// @param	internalTokenIndex	Index of the token within the range
	function buyToken(uint catalogIndex, uint rangeIndex, uint internalTokenIndex) payable public {
		offer storage selectedProduct = offerCatalog[catalogIndex];
		require(selectedProduct.contractAddress != address(0), "Minting Marketplace: Invalid Product Selected!");
		require((selectedProduct.tokensAllowed.length > rangeIndex), "Minting Marketplace: Invalid range!");
		require((selectedProduct.tokensAllowed[rangeIndex] > 0), "Minting Marketplace: Cannot mint more tokens for this range!");
		require(selectedProduct.tokenRangeStart[rangeIndex] <= internalTokenIndex &&
				internalTokenIndex <= selectedProduct.tokenRangeEnd[rangeIndex],
					"Minting Marketplace: Token doesn't belong in that offer range!");
		require(msg.value >= selectedProduct.rangePrice[rangeIndex], "Minting Marketplace: Insuficient Funds!");

		customPayment storage aux = customPayments[catalogIndex];

		if (aux.recipients.length > 0) {
			for (uint i = 0; i < aux.recipients.length; i++) {
				payable(aux.recipients[i]).transfer((selectedProduct.rangePrice[rangeIndex] * aux.percentages[i]) / 100000);
			}
		} else {
			address creatorAddress;
			uint256 amount;

			bool hasFees = IERC2981(selectedProduct.contractAddress).supportsInterface(type(IERC2981).interfaceId);
			// If the token minted supports the EIP2981 interface, ask for the creator fee!
			if (hasFees) {
				(creatorAddress, amount) = IRAIR_ERC721(selectedProduct.contractAddress).royaltyInfo(0, selectedProduct.rangePrice[rangeIndex]);
				// Send the creator fee to the creator
				// Should send whatever's left after transferring treasury and node fees
				payable(creatorAddress).transfer(selectedProduct.rangePrice[rangeIndex] * (100000 - (treasuryFee + nodeFee)) / 100000);
			}
		}
		// Pay the buyer any excess they transferred
		payable(msg.sender).transfer(msg.value - selectedProduct.rangePrice[rangeIndex]);
		// Pay the treasury
		payable(treasury).transfer((selectedProduct.rangePrice[rangeIndex] * treasuryFee) / 100000);
		// Pay the node
		payable(selectedProduct.nodeAddress).transfer((selectedProduct.rangePrice[rangeIndex] * nodeFee) / 100000);

		selectedProduct.tokensAllowed[rangeIndex]--;
		if (selectedProduct.tokensAllowed[rangeIndex] == 0) {
			openSales--;
			emit SoldOut(selectedProduct.contractAddress, catalogIndex, rangeIndex);
		}
		IRAIR_ERC721(selectedProduct.contractAddress).mint(msg.sender, selectedProduct.productIndex, internalTokenIndex);
		emit TokenMinted(msg.sender, selectedProduct.contractAddress, catalogIndex, rangeIndex, internalTokenIndex);
	}

	function buyTokenBatch(uint catalogIndex, uint rangeIndex, uint[] calldata tokenIndexes, address[] calldata recipients) payable external {
		offer storage selectedProduct = offerCatalog[catalogIndex];
		require(selectedProduct.contractAddress != address(0), "Minting Marketplace: Invalid Product Selected!");
		require((selectedProduct.tokensAllowed.length > rangeIndex), "Minting Marketplace: Invalid range!");
		require((selectedProduct.tokensAllowed[rangeIndex] >= tokenIndexes.length), "Minting Marketplace: Cannot mint that many tokens for this range!");
		require(msg.value >= (selectedProduct.rangePrice[rangeIndex] * tokenIndexes.length), "Minting Marketplace: Insuficient Funds!");
		require(tokenIndexes.length == recipients.length, "Minting Marketplace: Token Indexes and Recipients should have the same length");

		customPayment storage aux = customPayments[catalogIndex];

		if (aux.recipients.length > 0) {
			for (uint i = 0; i < aux.recipients.length; i++) {
				payable(aux.recipients[i]).transfer(((selectedProduct.rangePrice[rangeIndex] * aux.percentages[i]) / 100000) * tokenIndexes.length);
			}
		} else {
			address creatorAddress;
			uint256 amount;

			bool hasFees = IERC2981(selectedProduct.contractAddress).supportsInterface(type(IERC2981).interfaceId);
			
			// If the token minted supports the EIP2981 interface, ask for the creator fee!
			if (hasFees) {
				(creatorAddress, amount) = IRAIR_ERC721(selectedProduct.contractAddress).royaltyInfo(0, selectedProduct.rangePrice[rangeIndex]);
				// Send the creator fee to the creator
				// Should send whatever's left after transferring treasury and node fees
				payable(creatorAddress).transfer((selectedProduct.rangePrice[rangeIndex] * (100000 - (treasuryFee + nodeFee)) / 100000) * tokenIndexes.length);
			}
		}
		// Pay the buyer any excess they transferred
		payable(msg.sender).transfer(msg.value - (selectedProduct.rangePrice[rangeIndex] * tokenIndexes.length));

		// Pay the treasury
		payable(treasury).transfer(((selectedProduct.rangePrice[rangeIndex] * treasuryFee) / 100000) * tokenIndexes.length);
		
		// Pay the node
		payable(selectedProduct.nodeAddress).transfer(((selectedProduct.rangePrice[rangeIndex] * nodeFee) / 100000) * tokenIndexes.length);
		
		selectedProduct.tokensAllowed[rangeIndex] -= tokenIndexes.length;
		if (selectedProduct.tokensAllowed[rangeIndex] == 0) {
			openSales--;
			emit SoldOut(selectedProduct.contractAddress, catalogIndex, rangeIndex);
		}

		for (uint256 i = 0; i < tokenIndexes.length; i++) {
			require(selectedProduct.tokenRangeStart[rangeIndex] <= tokenIndexes[i] &&
					tokenIndexes[i] <= selectedProduct.tokenRangeEnd[rangeIndex],
						"Minting Marketplace: Token doesn't belong in that offer range!");
			IRAIR_ERC721(selectedProduct.contractAddress).mint(recipients[i], selectedProduct.productIndex, tokenIndexes[i]);
			emit TokenMinted(recipients[i], selectedProduct.contractAddress, catalogIndex, rangeIndex, tokenIndexes[i]);
		}
	}
}