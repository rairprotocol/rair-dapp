// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

// Used on interfaces
import '@openzeppelin/contracts/access/AccessControl.sol';
import "../Tokens/IRAIR-ERC721.sol";
import "../Tokens/IERC2981.sol";

// Parent classes
import '@openzeppelin/contracts/access/Ownable.sol';

import 'hardhat/console.sol';

/// @title  Minter Marketplace 
/// @notice Handles the resale of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the transfer mechanisms on other tokens!
contract Resale_Marketplace is Ownable {
	struct offer {
		address contractAddress;
		address nodeAddress;
		uint productIndex;
		uint tokenIndex;
		uint price;
		bool sold;
		bool paused;
	}

	struct customPayment {
		address[] recipients;
		uint[] percentages;
	}

	address treasury;
	uint16 treasuryFee;
	uint16 nodeFee;

	uint16 public constant feeDecimals = 3;
	uint public openSales = 0;

	mapping(address => mapping(uint => uint)) internal _tokenToOffers;
	mapping(uint => customPayment) internal _customPayments;

	offer[] offerCatalog;
	event CreatedOffer(address contractAddress, uint tokenIndex, uint price, uint catalogIndex);
	event DeletedOffer(address contractAddress, uint tokenIndex, uint price, uint catalogIndex);
	event CustomFeesSet(uint catalogIndex, address[] recipients, uint[] percentages);
	event BoughtOffer(address contractAddress, uint tokenIndex, uint price, uint catalogIndex);

	event UpdatedOffer(address contractAddress, uint tokenIndex, uint price, bool paused, uint catalogIndex);
	event ChangedTreasury(address newTreasury);
	event ChangedTreasuryFee(address treasury, uint16 newTreasuryFee);
	event ChangedNodeFee(uint16 newNodeFee);

	/// @notice	Constructor
	/// @dev	Should be initialized with the treasury, node and treasury fee
	/// @param	_treasury		The address of the Treasury
	/// @param	_treasuryFee	Fee given to the treasury every sale (Recommended default: 9000 or 9%)
	/// @param	_nodeFee		Fee given to the node on every sale (Recommended default: 1000 or 1%)
	constructor(address _treasury, uint16 _treasuryFee, uint16 _nodeFee) {
		treasury = _treasury;
		treasuryFee = _treasuryFee;
		nodeFee = _nodeFee;
		openSales = 0;
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

	/// @notice Validates that the Resale Marketplace and the message sender have the correct roles inside the ERC721
	/// @dev	Doubles as a view function for anyone wondering if they can mint or if they need to approve the marketplace
	/// @param	_contractAddress 	Address of the token to validate
	function validateRoles(address _contractAddress, uint _tokenId) public view returns (bool canOffer) {
		require(IAccessControl(_contractAddress).hasRole(bytes32(keccak256("TRADER")), address(this)), "Resale Marketplace: This Marketplace isn't a trader!");
		require(IERC721(_contractAddress).ownerOf(_tokenId) == msg.sender, "Resale Marketplace: Sender isn't the owner of the token!");
		return true;
	}

	/// @notice	Creates an offer to the market's catalog
	/// @param	_contractAddress		Address of the ERC721 contract
	/// @param	_tokenIndex				Index of the token
	/// @param	_nodeAddress			Address of the node that will receive the Node Fee
	/// @param	_price					Price of the token
	function addOffer (address _contractAddress, uint _tokenIndex, address _nodeAddress, uint _price, bool _paused) public {
		validateRoles(_contractAddress, _tokenIndex);
		if (offerCatalog.length > 0) {
			require(_tokenToOffers[_contractAddress][_tokenIndex] == 0, "Resale Marketplace: An offer already exists for this token");
			if (_tokenToOffers[_contractAddress][_tokenIndex] == 0) {
				require((offerCatalog[_tokenToOffers[_contractAddress][_tokenIndex]].contractAddress != _contractAddress &&
					offerCatalog[_tokenToOffers[_contractAddress][_tokenIndex]].tokenIndex != _tokenIndex) ||
					offerCatalog[_tokenToOffers[_contractAddress][_tokenIndex]].sold == true,
					"Resale Marketplace: An offer already exists for this token");
			}
		}

		offer storage newOffer = offerCatalog.push();
		newOffer.contractAddress = _contractAddress;
		newOffer.nodeAddress = _nodeAddress;
		newOffer.tokenIndex = _tokenIndex;
		newOffer.price = _price;
		newOffer.sold = false;
		newOffer.paused = _paused;

		_tokenToOffers[_contractAddress][_tokenIndex] = offerCatalog.length - 1;
		emit CreatedOffer(_contractAddress, _tokenIndex, _price, offerCatalog.length - 1);
		openSales++;
	}

	/// @notice	Batch version of addOffer for convenience, gas consumption is the same
	function addOfferBatch (
			address[] calldata _contractAddresses,
			uint[] calldata _tokenIndexes,
			address _nodeAddress,
			uint[] calldata _prices,
			bool[] calldata _pauses
		) external {
		require(_contractAddresses.length == _tokenIndexes.length && _contractAddresses.length == _prices.length, "Resale Marketplace: Prices, Addresses and Tokens should have the same length!");
		for (uint i = 0; i < _contractAddresses.length; i++) {
			addOffer(_contractAddresses[i], _tokenIndexes[i], _nodeAddress, _prices[i], _pauses[i]);
		}
	}

	function updateOffer (uint _catalogIndex, uint _newPrice, bool _paused) public {
		offer storage selectedOffer = offerCatalog[_catalogIndex];
		require(selectedOffer.sold == false, "Resale Marketplace: Offer already sold");
		require(selectedOffer.contractAddress != address(0), "Resale Marketplace: Invalid offer");
		validateRoles(selectedOffer.contractAddress, selectedOffer.tokenIndex);
		selectedOffer.price = _newPrice;
		selectedOffer.paused = _paused;
		emit UpdatedOffer(selectedOffer.contractAddress, selectedOffer.tokenIndex, selectedOffer.price, _paused, _catalogIndex);
	}

	function deleteOffer (uint _catalogIndex) public {
		offer storage selectedOffer = offerCatalog[_catalogIndex];
		require(selectedOffer.contractAddress != address(0), "Resale Marketplace: Invalid offer");
		require(selectedOffer.sold == false, "Resale Marketplace: Offer already sold");
		validateRoles(selectedOffer.contractAddress, selectedOffer.tokenIndex);
		emit DeletedOffer(selectedOffer.contractAddress, selectedOffer.tokenIndex, selectedOffer.price, _catalogIndex);
		_tokenToOffers[selectedOffer.contractAddress][selectedOffer.tokenIndex] = 0;
		selectedOffer.sold = true;		
		openSales--;
	}

	function getOffer(uint _catalogIndex) public view returns (address contractAddress, uint tokenIndex, uint price, bool sold, bool paused) {
		require(_catalogIndex < offerCatalog.length, "Resale Marketplace: Out of bounds index");
		offer storage selectedOffer = offerCatalog[_catalogIndex];
		require(selectedOffer.contractAddress != address(0), "Resale Marketplace: Invalid offer");
		return (selectedOffer.contractAddress, selectedOffer.tokenIndex, selectedOffer.price, selectedOffer.sold, selectedOffer.paused);
	}

	function setCustomFees(uint _catalogIndex, address[] calldata _recipients, uint[] calldata _percentages, bool _paused) external {
		offer storage selectedOffer = offerCatalog[_catalogIndex];
		require(selectedOffer.contractAddress != address(0), "Resale Marketplace: Invalid offer");
		require(selectedOffer.sold == false, "Resale Marketplace: Offer already sold");
		validateRoles(selectedOffer.contractAddress, selectedOffer.tokenIndex);
		require(_recipients.length == _percentages.length, "Resale Marketplace: Recipients and Percentages should have the same length");
		uint total = 0;
		for (uint i = 0; i < _recipients.length; i++) {
			total = total + _percentages[i];
		}
		require(total + treasuryFee + nodeFee == (100*(10**feeDecimals)), "Minting Marketplace: Percentages should add up to 100% (including node fee and treasury fee)");
		customPayment storage aux = _customPayments[_catalogIndex];
		aux.recipients = _recipients;
		aux.percentages = _percentages;
		selectedOffer.paused = _paused;
		emit CustomFeesSet(_catalogIndex, _recipients, _percentages);
	}

	function buyOffer(uint _catalogIndex) public payable {
		offer storage selectedOffer = offerCatalog[_catalogIndex];
		require(selectedOffer.contractAddress != address(0), "Resale Marketplace: Invalid offer");
		require(selectedOffer.sold == false, "Resale Marketplace: Offer already sold");
		require(msg.value >= selectedOffer.price, "Resale Marketplace: Not enough funds");
		customPayment storage aux = _customPayments[_catalogIndex];
		uint calculatedPercentageTotal = (100*(10**feeDecimals));
		address owner = IRAIR_ERC721(selectedOffer.contractAddress).ownerOf(selectedOffer.tokenIndex);
		if (aux.recipients.length > 0) {
			for (uint i = 0; i < aux.recipients.length; i++) {
				payable(aux.recipients[i]).transfer((selectedOffer.price * aux.percentages[i]) / calculatedPercentageTotal);
			}
		} else {
			address creatorAddress;
			uint256 amount;

			bool hasFees = IERC2981(selectedOffer.contractAddress).supportsInterface(type(IERC2981).interfaceId);
			// If the token minted supports the EIP2981 interface, ask for the creator fee!
			if (hasFees) {
				(creatorAddress, amount) = IRAIR_ERC721(selectedOffer.contractAddress).royaltyInfo(0, selectedOffer.price);
				// Send the creator fee to the creator
				// Should send whatever's left after transferring treasury and node fees
				payable(creatorAddress).transfer(amount);
			}
			payable(owner).transfer((selectedOffer.price * (calculatedPercentageTotal - nodeFee - treasuryFee)  / calculatedPercentageTotal) - amount);
		}
		// Pay the buyer any excess they transferred
		payable(msg.sender).transfer(msg.value - selectedOffer.price);
		// Pay the treasury
		payable(treasury).transfer((selectedOffer.price * treasuryFee) / calculatedPercentageTotal);
		// Pay the node
		payable(selectedOffer.nodeAddress).transfer((selectedOffer.price * nodeFee) / calculatedPercentageTotal);

		selectedOffer.sold = true;
		openSales--;

		IRAIR_ERC721(selectedOffer.contractAddress).safeTransferFrom(owner, msg.sender, selectedOffer.tokenIndex);
		emit BoughtOffer(selectedOffer.contractAddress, selectedOffer.tokenIndex, selectedOffer.price, _catalogIndex);
	}

	/*function buyOfferBatch(uint[] calldata catalogIndexes) external payable {
		for (uint i = 0; i < catalogIndexes.length; i++) {
			buyOffer(catalogIndexes[i]);
		}
	}*/
}