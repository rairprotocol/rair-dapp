// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

struct RoleData {
	mapping(address => bool) members;
	bytes32 adminRole;
}
 
/// @title  A contract that administrate roles & access
/// @notice You can use this contract to modify and define the role of an user
abstract contract AccessControlEnumerable is Context {	
    /// @notice This event stores in the blockchain when an admin role changes
    /// @param  role Contains the admin role that we want to use 
    /// @param  previousAdminRole Contains the previous admin role
    /// @param  newAdminRole Contains the new admin role
	event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
	/// @notice This event stores in the blockchain when a role is granted
    /// @param  role Contains the admin role that we want to use 
    /// @param  account Contains the account we want to add to a new role
    /// @param  sender Contains the sender of the role petition
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    /// @notice This event stores in the blockchain when a role is revoked
    /// @param  role Contains the admin role that we want to use 
    /// @param  account Contains the account we want to add to a new role
    /// @param  sender Contains the sender of the role petition
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    modifier onlyRole(bytes32 role) {
        _checkRole(role, _msgSender());
        _;
    }

    /// @notice Allow an user to quit an owned role
    /// @notice The account that sends the petition needs to be the same that will renounce to a role
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use.    
    function renounceRole(bytes32 role, address account) public {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");
        _revokeRole(role, account);
    }

    /// @notice Allow an admin to asign a new role to an account
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use. 
    function grantRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /// @notice Allow an admin to revoke a role to an account
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use. 
    function revokeRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /// @notice Allow to verify if the account has a role
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use. 
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

    /// @notice Allow to verify if the account has a role
    /// @param  role Contains the role that we want to verify 
    /// @param  account Contains the account address to check. 
    /// @return role in boolean, if the account has the selected role
    function hasRole(bytes32 role, address account) public view virtual returns (bool);

	/// @notice Allow us to verify the branch of roles asociated to an father role
    /// @param  role Contains the role that we want to verify
    /// @return bytes32 with the child role
    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32);

    /// @notice Check if the account with the index has the desired role
    /// @param  role Contains the role that we want to use 
    /// @param  index Contains the index asociated to an account
    /// @return address of the account with the index position in the list of the desired role
	function getRoleMember(bytes32 role, uint256 index) public view virtual returns (address);

    /// @notice Allow to verify if the account has a role
    /// @param  role Contains the role that we want to verify
    /// @return uint256 wuth he total of members with the desired role 
	function getRoleMemberCount(bytes32 role) public view virtual returns (uint256);

    /// @param role Contains the role that we want to use 
    /// @param adminRole Contains the new admin role to use
	function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual;

    /// @notice Grants a role to an account
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use. 
	function _grantRole(bytes32 role, address account) internal virtual;

    /// @notice Revokes a role to an account 
    /// @param  role Contains the role that we want to use 
    /// @param  account Contains the account address to use. 
	function _revokeRole(bytes32 role, address account) internal virtual;
}