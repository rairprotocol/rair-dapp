// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library ResaleStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.resaleOffers');

    struct feeSplits {
        address recipient;
        uint percentage;
    }

    struct Layout {
        mapping(address => feeSplits[]) royaltySplits;
        mapping(address => address) contractOwner;
        uint purchaseGracePeriod;
        uint decimalPow;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}