// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18; 

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title  Test contract with a receive function
contract ReceiverTest is Ownable {
    constructor() {}

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}