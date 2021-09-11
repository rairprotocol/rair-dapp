// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 


import "./RAIR_ERC721Creator";

contract RAIR_ResaleDriver is RAIR_ERC721Creator {
    constructor () RAIR_ERC721Creator { "RAIR TECH", "RAIR") {}
}