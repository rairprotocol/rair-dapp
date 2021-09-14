// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * Implement interface request for extension to have overloadable URI's
 */
interface IRAIR_ResaleCreaterTokenURI is IERC165 {

    /**
     * URL for a given creator/tokenId
     */
    function tokenURI(address creator, uint256 tokenId) external view returns (string memory);
}