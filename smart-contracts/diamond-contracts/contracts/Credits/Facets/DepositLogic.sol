// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { CreditHandlerRoles } from '../AccessControlRoles.sol';
import { CreditHandlerStorage } from '../Storage/CreditHandlerStorage.sol';

/// @title 	Deposit logic for the credit system
/// @notice Uses the ERC777 receiver hook to trigger additional logic
contract CreditDeposit is AccessControlEnumerable, CreditHandlerRoles {
    /// @notice This event stores the user that deposited tokens into the contract
    /// @param	userAddress             Public address of the user depositing
    /// @param 	tokenAddress            Address of the ERC777 contract used
    /// @param 	amount                  Amount of tokens transferred to this contract
	/// @param 	totalTokensDeposited    Total amount of tokens deposited by the user
	event ReceivedTokens(address userAddress, address tokenAddress, uint amount, uint totalTokensDeposited);

	/// @notice Function called by an ERC777 when they send tokens
	/// @dev   	This is our deposit mechanism
	/// @param 	operator The ERC777 operator calling the send() function
	/// @param 	from The owner of the tokens
	/// @param 	to The recipient of the tokens
	/// @param 	amount The number of tokens sent
	/// @param 	userData bytes sent from the send call
	/// @param 	operatorData bytes sent from the operator
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external onlyRole(ALLOWED_ERC777) {
        require(to == address(this), "CreditConsumer: Invalid destination");
        CreditHandlerStorage.Layout storage storageData = CreditHandlerStorage.layout();
		storageData.userCreditBalance[msg.sender][from] += amount;
		storageData.overallUserCreditBalance[from] += amount;
		emit ReceivedTokens(
            from,
            msg.sender,
            amount,
            storageData.userCreditBalance[msg.sender][from]
        );
	}
}