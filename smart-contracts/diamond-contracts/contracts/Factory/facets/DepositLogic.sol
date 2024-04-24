// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { FactoryHandlerRoles } from '../AccessControlRoles.sol';
import { FactoryStorage } from "../AppStorage.sol";

/// @title 	Deposit logic for the points system
/// @notice Uses the ERC777 receiver hook to trigger additional logic
contract PointsDeposit is AccessControlEnumerable, FactoryHandlerRoles {
    /// @notice This event stores the user that deposited tokens into the contract
    /// @param	userAddress             Public address of the user depositing
    /// @param 	tokenAddress            Address of the ERC777 contract used
    /// @param 	amount                  Amount of tokens transferred to this contract
	/// @param 	totalTokensDeposited    Total amount of tokens deposited by the user
	event ReceivedTokens(address userAddress, address tokenAddress, uint amount, uint totalTokensDeposited);

	/// @notice Deposit tokens from the user's balance to this contract
	/// @param 	amount The number of tokens sent
    function depositTokens(uint256 amount) external {
        FactoryStorage.Layout storage store = FactoryStorage.layout();
		require(
			IERC20(store.currentERC20).allowance(msg.sender, address(this)) >= amount,
			'PointsDeposit: Not allowed to transfer tokens'
		);
		require(
			IERC20(store.currentERC20).transferFrom(msg.sender, address(this), amount),
			'PointsDeposit: Error transferring tokens'
		);

		store.totalUserPoints[msg.sender] += amount;
		store.currentUserPoints[msg.sender] += amount;

		emit ReceivedTokens(
            msg.sender,
            store.currentERC20,
            amount,
            store.currentUserPoints[msg.sender]
        );
	}
}