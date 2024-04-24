// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

library ResaleStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.resaleOffers');

    struct feeSplits {
        address recipient;
        uint percentage;
    }

    struct resaleOffer {
        address erc721;
        address buyer;
        address seller;
        uint token;
        uint tokenPrice;
        address nodeAddress;
    }

    struct Layout {
        mapping(address => feeSplits[]) royaltySplits;
        mapping(address => address) contractOwner;
        uint purchaseGracePeriod;
        uint decimalPow;
        resaleOffer[] resaleOffers;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}