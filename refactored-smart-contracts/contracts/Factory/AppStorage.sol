// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10; 

import '@openzeppelin/contracts/access/AccessControlEnumerable.sol';

struct RoleData {
	mapping(address => bool) members;
	bytes32 adminRole;
}

struct AppStorage {
	mapping(address => address[]) ownerToContracts;
	mapping(address => address) contractToOwner;
	mapping(address => uint) deploymentCostForERC777;
	address[] creators;
	// Access Control Enumerable
	mapping(bytes32 => RoleData) _roles;
	string failsafe;
}

library LibAppStorage {
	function diamondStorage() internal pure	returns (AppStorage storage ds) {
		assembly {
			ds.slot := 0
		}
	}
}

import 'hardhat/console.sol';

// OpenZeppelin Contracts v4.4.0 (access/AccessControl.sol)
contract AccessControlAppStorageEnumerable is AccessControlEnumerable {

	// The following functions override AccessControlEnumerable functions
	//		to use Diamond AppStorage

	/**
	 * @dev Returns `true` if `account` has been granted `role`.
	 */
	function hasRole(bytes32 role, address account) public view override returns (bool) {
		AppStorage storage s = LibAppStorage.diamondStorage();
		console.log("Requested has role", s.failsafe);
		return s._roles[role].members[account];
	}

	/**
	 * @dev Returns the admin role that controls `role`. See {grantRole} and
	 * {revokeRole}.
	 *
	 * To change a role's admin, use {_setRoleAdmin}.
	 */
	function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
		AppStorage storage s = LibAppStorage.diamondStorage();
		console.log("Requested role admin", s.failsafe);
		return s._roles[role].adminRole;
	}

	/**
	 * @dev Sets `adminRole` as ``role``'s admin role.
	 *
	 * Emits a {RoleAdminChanged} event.
	 */
	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual override {
		AppStorage storage s = LibAppStorage.diamondStorage();
		console.log("Requested role admin", s.failsafe);
		bytes32 previousAdminRole = getRoleAdmin(role);
		s._roles[role].adminRole = adminRole;
		emit RoleAdminChanged(role, previousAdminRole, adminRole);
	}

	/**
	 * @dev Grants `role` to `account`.
	 *
	 * Internal function without access restriction.
	 */
	function _grantRole(bytes32 role, address account) internal virtual override {
		AppStorage storage s = LibAppStorage.diamondStorage();
		console.log("Requested role admin", s.failsafe);
		if (!hasRole(role, account)) {
			s._roles[role].members[account] = true;
			emit RoleGranted(role, account, _msgSender());
		}
	}

	/**
	 * @dev Revokes `role` from `account`.
	 *
	 * Internal function without access restriction.
	 */
	function _revokeRole(bytes32 role, address account) internal virtual override {
		AppStorage storage s = LibAppStorage.diamondStorage();
		console.log("Requested role admin", s.failsafe);
		if (hasRole(role, account)) {
			s._roles[role].members[account] = false;
			emit RoleRevoked(role, account, _msgSender());
		}
	}
}