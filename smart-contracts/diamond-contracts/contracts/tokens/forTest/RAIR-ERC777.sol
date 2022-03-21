// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11; 
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

/// @title  RAIR 777 for testing
/// @notice This contract is used for testing purpouse
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from ERC777
contract RAIR777 is ERC777 {
    constructor(uint256 initialSupply, address[] memory _defaultOperators )
        ERC777("RAIR", "RAIR", _defaultOperators)
    {
        _mint(msg.sender, initialSupply, "", "");
    }

    receive() external payable {}
}