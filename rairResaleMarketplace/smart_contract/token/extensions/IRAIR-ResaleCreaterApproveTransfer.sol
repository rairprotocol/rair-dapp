// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6; 

import "./IRAIR-ResaleCreaterExtension.sol";

/**
 * Implement interface request for extension to approve a transfer
 */
interface IRAIR_ResaleCreaterApproveTransfer is IRAIR_ResaleCreaterExtension {

    /**
     * @notice Set whether or not, the creator will check this extension to approval transfer of tokens in the resale
     */
    function approveTransferSet(address creator, bool enabled) external;

    /**
     * @notice Approve a transfer
     */
    function approveTransfer(address from, address to, uint256 tokenId) external returns (bool);
}