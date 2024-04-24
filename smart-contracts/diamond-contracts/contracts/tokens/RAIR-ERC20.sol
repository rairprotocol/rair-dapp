// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25; 
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { AccessControlEnumerable } from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

contract RAIR20 is ERC20, ERC20Burnable, AccessControlEnumerable {
	bytes32 public constant MINTER = keccak256("rair.contracts.erc20.minter");

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address recipient
    ) ERC20(name, symbol)  {
         _setRoleAdmin(MINTER, DEFAULT_ADMIN_ROLE);
         _grantRole(DEFAULT_ADMIN_ROLE, recipient);
         _grantRole(MINTER, recipient);
        _mint(recipient, initialSupply);
    }

    function mint(address recipient, uint256 supply) public onlyRole(MINTER) {
        _mint(recipient, supply);
    }
}