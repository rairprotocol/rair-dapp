// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { FactoryStorage } from "../AppStorage.sol";

contract PointsQuery is AccessControlEnumerable {
    function getUserPoints(address userAddress) view external returns(uint balance) {
        balance = FactoryStorage.layout().currentUserPoints[userAddress];
    }

    function getTotalUserPoints(address userAddress) view external returns(uint balance) {
        balance = FactoryStorage.layout().totalUserPoints[userAddress];
    }
}