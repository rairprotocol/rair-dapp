// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 


import "./IRAIR-ResaleCreaterExtension.sol";

/**
 * If your wish extension to receive the onBurn callback when the 
 * token created by the extension is burned,
 * Keep this extension 
 */
interface IRAIR_ResaleCreaterBurnable is IRAIR_ResaleCreaterExtension {
    event CreatorAdded(address indexed creator, address indexed sender);

    /**
     * @notice mint token
     */
    function mint(address creator, address to) external returns (uint256);

    /**
     * @notice callback handler for burning event
     */
    function onBurn(address owner, uint256 tokenId) external;
}