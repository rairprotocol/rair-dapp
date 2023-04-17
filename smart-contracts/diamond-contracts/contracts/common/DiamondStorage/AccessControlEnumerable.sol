// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { AccessControlEnumerableStorage } from "./AccessControlEnumerableStorage.sol";

abstract contract AccessControlEnumerable is Context {
    using EnumerableSet for EnumerableSet.AddressSet;
    
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
	event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    modifier onlyRole(bytes32 role) {
        _checkRole(role, _msgSender());
        _;
    }

    function renounceRole(bytes32 role, address account) public {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
        _revokeRole(role, account);
    }

    function grantRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    function _checkRole(bytes32 role, address account) internal view {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

	function hasRole(bytes32 role, address account) public view returns (bool) {
		return AccessControlEnumerableStorage.layout()._roles[role].members[account];
	}

	function getRoleAdmin(bytes32 role) public view returns (bytes32) {
		return AccessControlEnumerableStorage.layout()._roles[role].adminRole;
	}

	function getRoleMember(bytes32 role, uint256 index) public view returns (address) {
		return AccessControlEnumerableStorage.layout()._roleMembers[role].at(index);
	}
	
	function getRoleMemberCount(bytes32 role) public view returns (uint256) {
		return AccessControlEnumerableStorage.layout()._roleMembers[role].length();
	}

	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal {
		bytes32 previousAdminRole = getRoleAdmin(role);
		AccessControlEnumerableStorage.layout()._roles[role].adminRole = adminRole;
		emit RoleAdminChanged(role, previousAdminRole, adminRole);
	}

	function _grantRole(bytes32 role, address account) internal {
		if (!hasRole(role, account)) {
			AccessControlEnumerableStorage.layout()._roles[role].members[account] = true;
			emit RoleGranted(role, account, _msgSender());
			AccessControlEnumerableStorage.layout()._roleMembers[role].add(account);
		}
	}

	function _revokeRole(bytes32 role, address account) internal {
		if (hasRole(role, account)) {
			AccessControlEnumerableStorage.layout()._roles[role].members[account] = false;
			emit RoleRevoked(role, account, _msgSender());
			AccessControlEnumerableStorage.layout()._roleMembers[role].remove(account);
		}
	}
}