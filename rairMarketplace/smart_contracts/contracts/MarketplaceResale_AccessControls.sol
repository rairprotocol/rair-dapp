// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "../interfaces/IRAIR_ERC721_ResaleAccessControls.sol";

contract MarketplaceResale_AccessControls is IRAIR_ERC721_ResaleAccessControls {
    constructor () public {
        super.addWhitelisted(msg.sender);
    }
}