// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../common/AccessControl.sol";

struct AppStorage {
	// Access Control Enumerable
	mapping(bytes32 => RoleData) _roles;
	string failsafe;
	mapping(bytes32 => EnumerableSet.AddressSet) _roleMembers;
	// App
	address[] creators;
	mapping(address => address[]) creatorToContracts;
	mapping(address => address) contractToCreator;
	mapping(address => uint) deploymentCostForToken;
	// Always add new variables at the end of the struct!
}

library LibAppStorage {
	function diamondStorage() internal pure	returns (AppStorage storage ds) {
		assembly {
			ds.slot := 0
		}
	}
}

contract AccessControlAppStorageEnumerable is Context, AccessControlEnumerable {
	using EnumerableSet for EnumerableSet.AddressSet;
	
	AppStorage internal s;

	function hasRole(bytes32 role, address account) public view override returns (bool) {
		return s._roles[role].members[account];
	}

	function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
		return s._roles[role].adminRole;
	}

	function getRoleMember(bytes32 role, uint256 index) public view override returns (address) {
		return s._roleMembers[role].at(index);
	}

	function getRoleMemberCount(bytes32 role) public view override returns (uint256) {
		return s._roleMembers[role].length();
	}

	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal override {
		bytes32 previousAdminRole = getRoleAdmin(role);
		s._roles[role].adminRole = adminRole;
		emit RoleAdminChanged(role, previousAdminRole, adminRole);
	}

	function _grantRole(bytes32 role, address account) internal override {
		if (!hasRole(role, account)) {
			s._roles[role].members[account] = true;
			emit RoleGranted(role, account, _msgSender());
			s._roleMembers[role].add(account);
		}
	}

	function _revokeRole(bytes32 role, address account) internal override {
		if (hasRole(role, account)) {
			s._roles[role].members[account] = false;
			emit RoleRevoked(role, account, _msgSender());
			s._roleMembers[role].remove(account);
		}
	}
}