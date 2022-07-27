//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../Tokens/IERC2981.sol";

contract Resale_MarketPlace is AccessControl {
	
	// Status of an offer
	enum OfferStatus{ OPEN, CLOSED, CANCELLED }

	// Data structure for the offers
	struct Offer {
		address sellerAddress;
		address contractAddress;
		uint tokenId;
		uint price;
		OfferStatus tradeStatus;
		address nodeAddress;
	}

	// Custom splits for an entire contract
	struct ContractCustomSplits {
		address[] recipients;
		uint[] percentages;
		uint precisionDecimals;
	}
	// Event emitted whenever an offer is created, completed or cancelled
	event OfferStatusChange(
		address operator,
		address tokenAddress,
		uint tokenId,
		uint price,
		OfferStatus status,
		uint tradeid
	);

	// Emitted whenever an offer is updated with a new price
	event UpdatedOfferPrice(
		uint offerId,
		uint oldPrice,
		uint newPrice
	);

	// Emitted when the treasury address is updated
	event ChangedTreasuryAddress(address newTreasury);
		
	// Emitted whenever the treasury fee is updated, includes the current treasury address
	event ChangedTreasuryFee(address treasuryAddress, uint newTreasuryFee);
	
	// Emitted whenever the node fee is updated
	event ChangedNodeFee(uint newNodeFee);

	// Emitted when custom splits are set/removed
	event CustomRoyaltiesSet(address contractAddress, uint recipients, uint remainderForSeller);

	address public treasuryAddress;
	uint16 public feeDecimals = 3;

	// The limit for this is 65535
	uint public nodeFee = 1000;
	uint public treasuryFee = 9000;

	mapping(uint => Offer) private offers;
	mapping(address => ContractCustomSplits) private contractSplits;

	mapping(address => mapping(uint => bool)) public tokenOnSale;

	bool public paused = false;

	uint private tradeCounter;
	uint private offerCounter;

	/// @notice 	Ensures the marketplace isn't paused
	modifier isPaused() {
		require(paused == false, "Resale Marketplace: Currently paused");
		_;
	}

	/// @notice 	Ensures the offer being managed is open
	/// @param 		offerIndex 		Index of the offer to manage
	modifier OpenOffer(uint offerIndex) {
		require(offers[offerIndex].tradeStatus == OfferStatus.OPEN, "Resale Marketplace: Offer is not available");
		_;
	}

	/// @notice     Makes sure the function can only be called by the creator of a RAIR contract
	/// @param      contractAddress    Address of the RAIR ERC721 contract
	modifier OnlyTokenCreator(address contractAddress) {
		IERC2981 itemToken = IERC2981(contractAddress);
		require(
			itemToken.supportsInterface(type(IERC2981).interfaceId),
			"Resale Marketplace: Only the EIP-2981 receiver can be recognized as the creator"
		);
		(address creator,) = itemToken.royaltyInfo(0, 100000);
		require(contractAddress != address(0), "Resale Marketplace: Invalid address specified");
		require(
			creator == msg.sender,
			"Resale Marketplace: Only token creator can set custom royalties"
		);
		_;
	}

	/// @notice 	Ensures only the NFT's holder is able to manage the offer
	/// @param 		contractAddress 	Address of the ERC721 contract
	/// @param 		tokenId 			Index of the NFT
	modifier OnlyTokenHolder(address contractAddress, uint256 tokenId) {
		_onlyTokenHolder(contractAddress, tokenId);
		_;
	}

	/// @notice 	Ensures the resale marketplace is approved to handle the NFT on behalf of the owner
	/// @param 		contractAddress 	Address of the ERC721 contract
	/// @param 		tokenId 			Index of the NFT
	modifier HasTransferApproval(address contractAddress, uint256 tokenId) {
		IERC721 itemToken = IERC721(contractAddress);
		require(
			contractAddress != address(0) &&
			tokenId >= 0,
			"Resale Marketplace: Invalid data"
		);
		require(
			itemToken.isApprovedForAll(itemToken.ownerOf(tokenId), address(this)) ||
			itemToken.getApproved(tokenId) == address(this),
			"Resale Marketplace: Marketplace is not approved"
		);
		_;
	}

	/// @notice 	Constructor
	/// @param 		_treasury 		Address of the treasury
	constructor(address _treasury) {
		treasuryAddress = _treasury;
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	/// @notice Utility function to verify that the recipient of a custom splits ISN'T a contract
	/// @dev 	This isn't a foolproof function, a contract running code in it's constructor has a code size of 0
	/// @param 	addr 	Address to verify
	/// @return bool that indicates if the address is a contract or not
	function isContract(address addr) internal view returns (bool) {
		uint size;
		assembly { size := extcodesize(addr) }
		return size > 0;
	}

	/// @notice 	Ensures only the NFT owner can manage the offer
	/// @param 		contractAddress 	Address of the ERC721 contract
	/// @param 		tokenId 			Index of the NFT
	function _onlyTokenHolder(address contractAddress, uint tokenId) internal view {
		IERC721 itemToken = IERC721(contractAddress);
		require(
			itemToken.ownerOf(tokenId) == msg.sender,
			"Resale Marketplace: Address does not own the token"
		);
	}

	/// @notice 	Returns information about a specific offer
	/// @param 		offerIndex 		Index of the offer on the marketplace
	/// @return 	selectedOffer 	Information about the offer
	function getOfferInfo(uint256 offerIndex) public view returns (Offer memory selectedOffer) {
		selectedOffer = offers[offerIndex];
	}

	/// @notice 	Sets a custom array of royalties for the entire ERC721 contract
	/// @dev 		You can send empty arrays to unset the creator royalties!
	/// @param 		contractAddress 	Address of the ERC721 contract
	/// @param 		recipients 			Array of addresses where the royalties will be sent, they cannot be smart contracts
	/// @param 		percentages 		Array of percentages (represented by integers)
	function setCustomRoyalties(
		address contractAddress,
		address[] calldata recipients,
		uint256[] calldata percentages
	) external OnlyTokenCreator(contractAddress) {
		require(
			recipients.length == percentages.length,
			"Resale Marketplace: Recipients and Percentages should have the same length"
		);

		uint256 total = 0;
		for (uint256 i = 0; i < recipients.length; i++) {
			require(
				isContract(recipients[i]) == false,
				"Resale Marketplace: For security reasons we don't allow smart contracts to receive funds"
			);
			total += percentages[i];
		}

		require(
			total < (100 * (10 ** feeDecimals)) - nodeFee - treasuryFee,
			"Resale Marketplace: Royalties exceed the 100%"
		);

		ContractCustomSplits storage splits = contractSplits[contractAddress];

		splits.precisionDecimals = feeDecimals;
		splits.recipients = recipients;
		splits.percentages = percentages;

		emit CustomRoyaltiesSet(
			contractAddress,
			recipients.length,
			(100 * (10 ** feeDecimals)) - nodeFee - treasuryFee - total
		);
	}

	/// @notice 	Creates a resale offer on the marketplace
	/// @param 		_tokenId 			Index of the NFT
	/// @param 		_price 				Price for the NFT to be sold
	/// @param 		_contractAddress 	Address of the ERC721 contract
	/// @param 		_nodeAddress 		Address of the RAIR node that will receive the node fee
	function createResaleOffer(
		uint256 _tokenId,
		uint256 _price,
		address _contractAddress,
		address _nodeAddress
	)
		external
		HasTransferApproval(_contractAddress, _tokenId)
		OnlyTokenHolder(_contractAddress, _tokenId)
		isPaused
	{
		require(
			isContract(_nodeAddress) == false,
			"Resale Marketplace: Node address cannot be a smart contract"
		);
		require(!isContract(msg.sender), 'Resale Marketplace: Cannot trust smart contracts as sellers');
		require(
			tokenOnSale[_contractAddress][_tokenId] == false,
			"Resale Marketplace: Token is already on sale"
		);

		offers[tradeCounter] = Offer({
			sellerAddress: msg.sender,
			contractAddress: _contractAddress,
			tokenId: _tokenId,
			price: _price,
			tradeStatus: OfferStatus.OPEN,
			nodeAddress: _nodeAddress
		});

		tradeCounter += 1;
		tokenOnSale[_contractAddress][_tokenId] = true;

		emit OfferStatusChange(
			msg.sender,
			_contractAddress,
			_tokenId,
			_price,
			OfferStatus.OPEN,
			tradeCounter - 1
		);
	}

	/// @notice 	Executes a sale, sending funds to any royalty recipients and transferring the token to the buyer
	/// @dev 		If custom splits exist, it will execute it, if they don't it will try to use the 2981 standard
	/// @param 		offerIndex 		Index of the offer on the marketplace
	function buyResaleOffer(uint256 offerIndex) public payable OpenOffer(offerIndex) isPaused {
		Offer memory selectedOffer = offers[offerIndex];
		require(
			msg.sender != address(0) && msg.sender != selectedOffer.sellerAddress,
			"Resale Marketplace: Invalid addresses"
		);
		require(!isContract(msg.sender), "Resale Marketplace: Cannot trust smart contract as buyer");
		require(msg.value >= selectedOffer.price, "Insuficient Funds!");

		uint totalPercentage = 100 * (10 ** feeDecimals);

		// Pay the buyer any excess they transferred
		payable(msg.sender).transfer(msg.value - selectedOffer.price);

		uint256 toRAIR = (selectedOffer.price * treasuryFee) / totalPercentage;
		
		payable(selectedOffer.nodeAddress).transfer((selectedOffer.price * nodeFee) / totalPercentage);
		payable(treasuryAddress).transfer(toRAIR);
		
		uint totalSent = ((selectedOffer.price * nodeFee) / totalPercentage) + toRAIR;

		ContractCustomSplits storage customSplits = contractSplits[selectedOffer.contractAddress];
		if (customSplits.recipients.length > 0) {
			uint i = 0;
			if (customSplits.precisionDecimals != feeDecimals) {
				for (; i < customSplits.recipients.length; i++) {
					customSplits.percentages[i] = _updatePrecision(customSplits.percentages[i], customSplits.precisionDecimals, feeDecimals);
				}
				i = 0;
			}
			for (; i < customSplits.recipients.length; i++) {
				uint toReceiver = selectedOffer.price * customSplits.percentages[i] / totalPercentage;
				payable(customSplits.recipients[i]).transfer(toReceiver);
				totalSent += toReceiver;
			}
		} else if (IERC2981(selectedOffer.contractAddress).supportsInterface(type(IERC2981).interfaceId)) {
			(address creator, uint royalty) = IERC2981(selectedOffer.contractAddress)
												.royaltyInfo(
													selectedOffer.tokenId,
													selectedOffer.price
												);
			totalSent += royalty;
			payable(creator).transfer(royalty);
		}

		uint256 toPoster = selectedOffer.price - totalSent;
		payable(selectedOffer.sellerAddress).transfer(toPoster);
		
		IERC721(selectedOffer.contractAddress).safeTransferFrom(
			address(selectedOffer.sellerAddress),
			payable(msg.sender),
			selectedOffer.tokenId
		);

		offers[offerIndex].tradeStatus = OfferStatus.CLOSED;
		tokenOnSale[selectedOffer.contractAddress][selectedOffer.tokenId] = false;

		emit OfferStatusChange(
			msg.sender,
			selectedOffer.contractAddress,
			selectedOffer.tokenId,
			selectedOffer.price,
			OfferStatus.CLOSED,
			offerIndex
		);
	}

	/// @notice 	Cancels an offer on the marketplace
	/// @dev 		This doesn't delete the entry, just marks it as CANCELLED
	/// @param 		offerIndex 		Index of the offer to be cancelled
	function cancelOffer(uint256 offerIndex) public OpenOffer(offerIndex) {
		Offer memory offer = offers[offerIndex];
		_onlyTokenHolder(offer.contractAddress, offer.tokenId);

		offers[offerIndex].tradeStatus = OfferStatus.CANCELLED;
		tokenOnSale[offer.contractAddress][offer.tokenId] = false;

		emit OfferStatusChange(
			msg.sender,
			offer.contractAddress,
			offer.tokenId,
			offer.price,
			OfferStatus.CANCELLED,
			offerIndex
		);
	}

	/// @notice 	Returns all open offers on the marketplace
	/// @dev 		This is a view function that uses loops, do not use on any non-view function
	/// @return 	An array of all open offers on the marketplace
	function getAllOnSale() public view virtual returns (Offer[] memory) {
		uint256 counter = 0;
		uint256 itemCounter = 0;
		for (uint256 i = 0; i < tradeCounter; i++) {
			if (offers[i].tradeStatus == OfferStatus.OPEN) {
				counter++;
			}
		}

		Offer[] memory tokensOnSale = new Offer[](counter);
		if (counter != 0) {
			for (uint256 i = 0; i < tradeCounter; i++) {
				if (offers[i].tradeStatus == OfferStatus.OPEN) {
					tokensOnSale[itemCounter] = offers[i];
					itemCounter++;
				}
			}
		}

		return tokensOnSale;
	}

	/// @notice 	Returns all offers made by an user
	/// @param 		user 		Address of the seller
	/// @return 	An array of all offers made by a specific user
	function getUserOffers(address user) public view returns (Offer[] memory) {
		uint256 counter = 0;
		uint256 itemCounter = 0;
		for (uint256 i = 0; i < tradeCounter; i++) {
			if (offers[i].sellerAddress == user) {
				counter++;
			}
		}

		Offer[] memory tokensByOwner = new Offer[](counter);
		if (counter != 0) {
			for (uint256 i = 0; i < tradeCounter; i++) {
				if (offers[i].sellerAddress == user) {
					tokensByOwner[itemCounter] = offers[i];
					itemCounter++;
				}
			}
		}

		return tokensByOwner;
	}

	/// @notice 	Updates the price of an offer
	/// @dev 		Price is the only thing that can be updated on any offer
	/// @param 		offerIndex 		Index of the offer
	/// @param 		newPrice 		New price for the offer
	function updateOffer(uint256 offerIndex, uint256 newPrice) public OpenOffer(offerIndex) {
		Offer storage selectedOffer = offers[offerIndex];
		_onlyTokenHolder(selectedOffer.contractAddress, selectedOffer.tokenId);
		if (msg.sender != selectedOffer.sellerAddress) {
			selectedOffer.sellerAddress = msg.sender;
		}
		uint oldPrice = selectedOffer.price;
		selectedOffer.price = newPrice;
		emit UpdatedOfferPrice(offerIndex, oldPrice, newPrice);
	}

	/// @notice 	Queries the marketplace to find if a token is on sale
	/// @param 		contractAddress 		Address of the ERC721 contract
	/// @param 		tokenId 				Index of the NFT
	/// @return 	Boolean value, true if there is an open offer on the marketplace
	function getTokenIdStatus(
		address contractAddress,
		uint256 tokenId
	) public view returns (bool) {
		return tokenOnSale[contractAddress][tokenId];
	}

	/// @notice 	Updates the treasury address
	/// @dev 		If the treasury is a contract, make sure it has a receive function
	/// @param 		_newTreasury 	New treasury address
	function setTreasuryAddress(
		address _newTreasury
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		require(_newTreasury != address(0), "invalid address");
		treasuryAddress = _newTreasury;
		emit ChangedTreasuryAddress(_newTreasury);
	}

	/// @notice Sets the new treasury fee
	/// @param _newFee New Fee
	function setTreasuryFee(
		uint _newFee
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		treasuryFee = _newFee;
		emit ChangedTreasuryFee(treasuryAddress, _newFee);
	}

	/// @notice 	Sets the new fee that will be paid to RAIR nodes
	/// @param 		_newFee 	New Fee
	function setNodeFee(uint _newFee) public onlyRole(DEFAULT_ADMIN_ROLE) {
		nodeFee = _newFee;
		emit ChangedNodeFee(_newFee);
	}

	/// @notice 	Updates the precision decimals on percentages and fees
	/// @dev 		Automatically updates node and treasury fees
	/// @dev 		Sales made before the update will have a special bit of code on sale execution to handle this change
	/// @dev 		New sales will be required to follow the new number of decimals
	/// @param 		_newDecimals 		New number of decimals
	function updateFeeDecimals(uint8 _newDecimals) public onlyRole(DEFAULT_ADMIN_ROLE) {
		treasuryFee = _updatePrecision(treasuryFee, feeDecimals, _newDecimals); 
		nodeFee = _updatePrecision(nodeFee, feeDecimals, _newDecimals); 
		feeDecimals = _newDecimals;
	}

	/// @notice 	Updates the precision of a number
	/// @dev 		Multiply first to not lose decimals on the way
	/// @return 	Updated number
	function _updatePrecision(uint number, uint oldDecimals, uint newDecimals) internal pure returns (uint) {
		return (number * (10 ** newDecimals)) / (10 ** oldDecimals); 
	}

	/// @notice 	Pauses / Resumes sales on the contract
	/// @dev 		Only prevents offer creation and executions, the other functions continue as normal
	/// @param 		_pause 		Boolean flag to pause (true) or resume (false) the contract
	function pauseContract(bool _pause) public onlyRole(DEFAULT_ADMIN_ROLE) {
		paused = _pause;
	}

	/// @notice  	Withdraws any funds stuck on the resale marketplace
	/// @dev 		There shouldn't be any funds stuck on the resale marketplace
	/// @param 		_amount 	Amount of funds to be withdrawn
	function withdraw(uint256 _amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
		payable(msg.sender).transfer(_amount);
	}
}