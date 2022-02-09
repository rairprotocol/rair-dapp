// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9; 
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract RAIR777 is ERC777, AccessControlEnumerable {
    bytes32 public constant MINTER = keccak256("MINTER");

    uint public maximumSupply;

    constructor(uint256 initialSupply, uint maximumSupply_, address owner, address[] memory _defaultOperators )
        ERC777("RAIR", "RAIR", _defaultOperators)
    {
        maximumSupply = maximumSupply_;
        _setRoleAdmin(MINTER, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
        _mint(owner, initialSupply, "", "");
    }

    function mint(uint amount, address recipient) public onlyRole(MINTER) {
        require(totalSupply() + amount <= maximumSupply, "RAIR 777: Cannot mint the required amount!");
        _mint(recipient, amount, "", "");
    }

    receive() external payable {}
}