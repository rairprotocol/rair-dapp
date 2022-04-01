// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

/// @title  This is a token protection contract
/// @notice The function of this contract prevent another contract to recieve the tokens
/// @dev    This contract will prevent another contract to sustract any token by causing a revert
/// @dev    The revert will occur if a contract, and not an user, try to buy any token
contract ReceiveEthAttacker {
    constructor() {

    }

    /// @notice Unexpected reverts would stop any token purchase, from the minter or the resale marketplace
    receive() external payable {
        require(false, "Unexpected Revert Attack!");
    }
}