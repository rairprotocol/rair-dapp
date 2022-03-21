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

/// @title 	An Access Control contract
/// @notice You can use this contract to modify and define the role of an user
contract AccessControlAppStorageEnumerable is Context, AccessControlEnumerable {
	using EnumerableSet for EnumerableSet.AddressSet;
	
	AppStorage internal s;

	/// @notice This function allow us to know if an user has or not an specific role
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the hasrole function inherited from AccessControlEnumerable
	/// @param 	role Contains the role we want to verify
    /// @param 	account Contains the address to match with the verification 
	/// @return bool Answer if the account has the input role or not
	function hasRole(bytes32 role, address account) public view override returns (bool) {
		return s._roles[role].members[account];
	}

	/// @notice Allows us to see what role is available to modify with the selected role
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the getRoleAdmin function inherited from AccessControlEnumerable
	/// @param 	role Contains the role that we want to check
	/// @return bytes32 the rol that in available to change
	function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
		return s._roles[role].adminRole;
	}

	/// @notice Allow us to use an index position to verify the account that has a role
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the getRoleMember function inherited from AccessControlEnumerable
	/// @param 	role Contains an specific role to check
    /// @param 	index Contains the position of the array that we want to verify
	/// @return address of the account with that position of the list of the selected role
	function getRoleMember(bytes32 role, uint256 index) public view override returns (address) {
		return s._roleMembers[role].at(index);
	}

	/// @notice Allow us to know the total of members that has a role
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the getRoleMemberCount function inherited from AccessControlEnumerable
	/// @param 	role Contains an specific role to check
	/// @return uint256 answer the cuantity of accounts with that role
	function getRoleMemberCount(bytes32 role) public view override returns (uint256) {
		return s._roleMembers[role].length();
	}

	/// @notice Allow us to use to set a new admin role
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the _setRoleAdmin function inherited from AccessControlEnumerable
	/// @param 	role Contains an specific role to check
    /// @param 	adminRole Contains the new admin role we want to provide
	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal override {
		bytes32 previousAdminRole = getRoleAdmin(role);
		s._roles[role].adminRole = adminRole;
		emit RoleAdminChanged(role, previousAdminRole, adminRole);
	}

	/// @notice Allow us to grant a new role to an account
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the _grantRole function inherited from AccessControlEnumerable
	/// @param 	role Contains the facet addresses and function selectors
    /// @param 	account Contains the facet addresses and function selectors
	function _grantRole(bytes32 role, address account) internal override {
		if (!hasRole(role, account)) {
			s._roles[role].members[account] = true;
			emit RoleGranted(role, account, _msgSender());
			s._roleMembers[role].add(account);
		}
	}

	/// @notice Allow us to revoke a role of an account
	/// @dev 	Notice that this function override the behavior of
	/// @dev 	the _revokeRole function inherited from AccessControlEnumerable
	/// @param 	role Contains the facet addresses and function selectors
    /// @param 	account Contains the facet addresses and function selectors
	function _revokeRole(bytes32 role, address account) internal override {
		if (hasRole(role, account)) {
			s._roles[role].members[account] = false;
			emit RoleRevoked(role, account, _msgSender());
			s._roleMembers[role].remove(account);
		}
	}
}