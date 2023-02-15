// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import { IERC777} from 'openzeppelin-v4.7.1/token/ERC777/IERC777.sol';
import { AccessControl } from 'openzeppelin-v4.7.1/access/AccessControl.sol';
import { IERC1820Registry } from "openzeppelin-v4.7.1/utils/introspection/IERC1820Registry.sol";

error InvalidEthValue(uint invalidAmount);

contract RAIR_Token_Purchaser is AccessControl {
	bytes32 public constant ADMINISTRATOR = keccak256("ADMINISTRATOR");
	bytes32 public constant ERC777 = keccak256("ERC777");

	mapping (uint => uint) internal indexOfPrice;
	mapping (uint => bool) internal validEthPrice;
	uint[] internal rairPrices;
	uint[] internal ethPrices;
	uint rairBalance;

	address rair777Address;

	event rairTokensAdded(address operator, uint amount);
	event rairTokensPurchased(address buyer, uint amount);

	constructor (address erc777Address) {
		IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
			.setInterfaceImplementer(
				address(this),
				keccak256("ERC777TokensRecipient"),
				address(this)
			);
		rair777Address = erc777Address;
		_setRoleAdmin(ADMINISTRATOR, DEFAULT_ADMIN_ROLE);
		_grantRole(ADMINISTRATOR, msg.sender);
		_grantRole(ERC777, erc777Address);
	}

	function getRAIR() external payable {
		if (!validEthPrice[msg.value]) {
			revert InvalidEthValue(msg.value);
		}
		require(rairPrices.length > 0, "No exchange data");
		uint amount = rairPrices[indexOfPrice[msg.value]];
		require(amount > 0, "Invalid value");
		require(rair777Address != address(0), "Invalid token address");
		IERC777 contractInstance = IERC777(rair777Address);
		contractInstance.send(msg.sender, amount, "RAIR Token Purchase");
		emit rairTokensPurchased(msg.sender, amount);
	}

	function setPrices(uint[] calldata newRairPrices, uint[] calldata newEthPrices) external onlyRole(ADMINISTRATOR) {
		require(newRairPrices.length == newEthPrices.length, "Lengths should match");
		uint index;
		for (index = 0; index < rairPrices.length; index++) {
			indexOfPrice[ethPrices[index]] = 0;
			validEthPrice[ethPrices[index]] = false;
		}
		rairPrices = newRairPrices;
		ethPrices = newEthPrices;
		for (index = 0; index < newRairPrices.length; index++) {
			indexOfPrice[newEthPrices[index]] = index;
			validEthPrice[ethPrices[index]] = true;
		}
	}

	function getExhangeRates() public view returns (uint[] memory, uint[] memory) {
		return (ethPrices, rairPrices);
	}

	function set777Address(address newAddress) public onlyRole(ADMINISTRATOR) {
		revokeRole(ERC777, rair777Address);
		rair777Address = newAddress;
		grantRole(ERC777, rair777Address);
	}

	function withdrawAllETH() public onlyRole(ADMINISTRATOR) {
		payable(msg.sender).transfer(address(this).balance);
	}

	function withdrawRAIR(uint amount) public onlyRole(ADMINISTRATOR) {
		IERC777 contractInstance = IERC777(rair777Address);
		contractInstance.send(msg.sender, amount, "RAIR Withdraw");
		rairBalance -= amount;
	}

	function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external onlyRole(ERC777) {
		require(to == address(this), "Tokens were not sent to this address");
		rairBalance += amount;
		emit rairTokensAdded(operator, amount);
	}
}