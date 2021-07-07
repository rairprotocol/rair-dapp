// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IRAIR_ERC721_ResaleAccessControls is IERC721 {
    function isWhitelisted(address account) public view returns (bool);
    function isWhitelistAdmin(address account) public view returns (bool);
}