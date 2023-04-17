// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library CreditHandlerStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.CreditConsumer');

    struct Layout {
        mapping(address => mapping(address => uint)) userCreditBalance;
        mapping(address => uint) overallUserCreditBalance;
        uint transferTimeLimit;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}