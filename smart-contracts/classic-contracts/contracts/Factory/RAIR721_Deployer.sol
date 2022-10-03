// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

// Parents
import "openzeppelin-v4.7.1/access/AccessControlEnumerable.sol";
import "../Tokens/RAIR721_Contract.sol";

interface IRAIR721_Deployer {
    function deployContract(address creator, string calldata title)
        external
        returns (address deploymentAddress);
}

// @title   RAIR ERC721 Deployer
// @notice  This contract is in charge of the deployment of the ERC721 RAIR Tokens
// @dev     This contract should be called by the master factory
contract RAIR721_Deployer is IRAIR721_Deployer, AccessControlEnumerable {
    bytes32 public constant MAINTAINER = keccak256("MAINTAINER");
    bytes32 public constant FACTORY = keccak256("FACTORY");

    /// @notice Factory Constructor
    /// @param  factoryAddress 		Address of the factory able to call the deploy function
    constructor(address factoryAddress) {
        _setRoleAdmin(MAINTAINER, MAINTAINER);
        _setRoleAdmin(FACTORY, MAINTAINER);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MAINTAINER, msg.sender);
        _setupRole(FACTORY, factoryAddress);
    }

    // @notice  Deploys the RAIR721 contracts
    // @dev     Can only be called by a FACTORY
    // @param   creator Contains the address of the sender of the ERC777 tokens
    // @param   title   Contains the name of the contract deployment
    function deployContract(address creator, string calldata title)
        external
        override
        onlyRole(FACTORY)
        returns (address deploymentAddress)
    {
        RAIR721_Contract newToken = new RAIR721_Contract(title, creator);
        return address(newToken);
    }
}
