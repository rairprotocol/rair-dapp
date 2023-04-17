// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { CreditHandlerRoles } from '../AccessControlRoles.sol';
import { CreditHandlerStorage } from '../Storage/CreditHandlerStorage.sol';

/// @title 	Deposit logic for the credit system
/// @notice Uses the ERC777 receiver hook to trigger additional logic
contract CreditQuery is AccessControlEnumerable, CreditHandlerRoles {
    function getUserCredits(address token, address userAddress) view external returns(uint balance) {
        balance = CreditHandlerStorage.layout().userCreditBalance[token][userAddress];
    }

    function getTotalUserCredits(address userAddress) view external returns(uint balance) {
        balance = CreditHandlerStorage.layout().overallUserCreditBalance[userAddress];
    }
}