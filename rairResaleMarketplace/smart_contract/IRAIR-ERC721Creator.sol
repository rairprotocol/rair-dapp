// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6; 

import "./RAIR-ResaleCreater.sol";

/**
 * @dev Core interface - ERC721 creator 
 */
interface IRAIR_ERC721Creator is IRAIR_ResaleCreater {

    /**
     * @notice mint a token with no extension. Can only be called by an trader.
     * Returns tokenId minted
     */
    function easyMint(address to) external returns (uint256);


    /**
     * @notice mint a token with no extension. Can only be called by an trader.
     * Returns tokenId minted
     */
    function easyMint(address to, string calldata uri) external returns (uint256);


    /**
     * @notice mint a token. Can only be called by a registered extension - resale.
     * Returns tokenId minted
     */
    function resaleableMint(address to) external returns (uint256);


    /**
     * @notice mint a token. Can only be called by a registered extension - resale.
     * Returns tokenId minted
     */
    function resaleableMint(address to, string calldata uri) external returns (uint256);

    
    /**
     * @notice burn a token. Can only be called by token owner or approved address.
     * When burning, call back the onBurn method of the registered extension
     */
    function burn(uint256 tokenId) external;

    function pause() external;

    function unpause() external;

}