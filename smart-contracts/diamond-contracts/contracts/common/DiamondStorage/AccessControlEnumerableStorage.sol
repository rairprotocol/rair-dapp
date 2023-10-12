// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library AccessControlEnumerableStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('rair.contracts.storage.AccessControlEnumerable');

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    struct Layout {
        mapping(bytes32 => RoleData) _roles;
        mapping(bytes32 => EnumerableSet.AddressSet) _roleMembers;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}