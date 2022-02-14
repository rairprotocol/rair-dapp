// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 

contract ReceiveEthAttacker {
    constructor() {

    }

    /// @notice Unexpected reverts would stop any token purchase, from the minter or the resale marketplace
    receive() external payable {
        require(false, "Unexpected Revert Attack!");
    }
}