// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

struct feeSplits {
	address recipient;
	uint percentage;
}

struct mintingOffer {
	address erc721Address;
	address nodeAddress;
	uint rangeIndex;
	feeSplits[] fees;
	bool visible;
}

struct RoleData {
	mapping(address => bool) members;
	bytes32 adminRole;
}

struct AppStorage {
	// Access Control Enumerable
	mapping(bytes32 => RoleData) _roles;
	mapping(bytes32 => EnumerableSet.AddressSet) _roleMembers;
	// App
	uint16 decimals;
	uint decimalPow;
	uint nodeFee;
	uint treasuryFee;
	address treasuryAddress;
	mintingOffer[] mintingOffers;
	mapping(address => mapping(uint => uint)) addressToRangeOffer;
	mapping(address => uint[]) addressToOffers;
	// Always add new fields at the end of the struct, that way the structure can be upgraded
}

library LibAppStorage {
	function diamondStorage() internal pure	returns (AppStorage storage ds) {
		assembly {
			ds.slot := 0
		}
	}
}

/// @title 	This is contract to manage the access control of the app market
/// @notice You can use this contract to administrate roles of the app market
/// @dev 	Notice that this contract is inheriting from Context
contract AccessControlAppStorageEnumerableMarket is Context {
	using EnumerableSet for EnumerableSet.AddressSet;
	
	AppStorage internal s;

	/// @notice This event stores in the blockchain when we change an admin role
    /// @param  role Contains the role we want to update
    /// @param  previousAdminRole contains the previous status of the role
	/// @param  newAdminRole contains the new status of the role
	event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
	/// @notice This event stores in the blockchain when we grant a role
    /// @param  role Contains the role we want to update
    /// @param  account contains the address that we want to grant the role
	/// @param  sender contains the address that is changing the role of the account
	event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
	/// @notice This event stores in the blockchain when we revoke a role
    /// @param  role Contains the role we want to update
    /// @param  account contains the address that we want to revoke the role
	/// @param  sender contains the address that is changing the role of the account
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    modifier onlyRole(bytes32 role) {
        _checkRole(role, _msgSender());
        _;
    }

	/// @notice Allow us to renounce to a role
	/// @dev 	Currently you can only renounce to your own roles
	/// @param 	role Contains the role to remove from our account
	/// @param 	account Contains the account that has the role we want to update
    function renounceRole(bytes32 role, address account) public {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
        _revokeRole(role, account);
    }

	/// @notice Allow us to grant a role to an account
	/// @dev 	This function is only available to an account with an Admin role
	/// @param 	role Contains the role that we want to grant
	/// @param 	account Contains the account that has the role we want to update
    function grantRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

	/// @notice Allow us to revoke a role to an account
	/// @dev 	This function is only available to an account with an Admin role
	/// @param 	role Contains the role that we want to revoke
	/// @param 	account Contains the account that has the role we want to update
    function revokeRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

	/// @notice Allow us to check the if and account has a selected role
	/// @param 	role Contains the role that we want to verify
	/// @param 	account Contains the account address thay we want to verify
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

	/// @notice Allow us to check the if and account has a selected role
	/// @param 	role Contains the role that we want to verify
	/// @param 	account Contains the account address thay we want to verify
	/// @return bool that indicates if an account has or not a role
	function hasRole(bytes32 role, address account) public view returns (bool) {
		return s._roles[role].members[account];
	}

	/// @notice Allow us to check the admin role that contains a role
	/// @param 	role Contains the role that we want to verify
	/// @return bytes that indicates if an account has or not an admin role
	function getRoleAdmin(bytes32 role) public view returns (bytes32) {
		return s._roles[role].adminRole;
	}

	/// @notice Allow us to check the address of an indexed position for the role list
	/// @param 	role Contains the role that we want to verify
	/// @param 	index Contains the indexed position to verify inside the role members list
	/// @return address that indicates the address indexed in that position
	function getRoleMember(bytes32 role, uint256 index) public view returns (address) {
		return s._roleMembers[role].at(index);
	}
	
	/// @notice Allow us to check total members that has an selected role
	/// @param 	role Contains the role that we want to verify
	/// @return uint256 that indicates the total accounts with that role
	function getRoleMemberCount(bytes32 role) public view returns (uint256) {
		return s._roleMembers[role].length();
	}

	/// @notice Allow us to modify a rol and set it as an admin role
	/// @param 	role Contains the role that we want to modify
	/// @param 	adminRole Contains the admin role that we want to set
	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal {
		bytes32 previousAdminRole = getRoleAdmin(role);
		s._roles[role].adminRole = adminRole;
		emit RoleAdminChanged(role, previousAdminRole, adminRole);
	}

	/// @notice Allow us to grant a role to an account
	/// @param 	role Contains the role that we want to grant
	/// @param 	account Contains the account that has the role we want to update
	function _grantRole(bytes32 role, address account) internal {
		if (!hasRole(role, account)) {
			s._roles[role].members[account] = true;
			emit RoleGranted(role, account, _msgSender());
			s._roleMembers[role].add(account);
		}
	}

	/// @notice Allow us to revoke a role to an account
	/// @param 	role Contains the role that we want to revoke
	/// @param 	account Contains the account that has the role we want to update
	function _revokeRole(bytes32 role, address account) internal {
		if (hasRole(role, account)) {
			s._roles[role].members[account] = false;
			emit RoleRevoked(role, account, _msgSender());
			s._roleMembers[role].remove(account);
		}
	}
}