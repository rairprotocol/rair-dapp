// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

// Used on interfaces
import "../access/ITraderControl.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";


/**
 * @notice Compliant with the interface required by the extended contract of ERC721 Creator
 */
interface IRAIR_ERC721CreatorMintPermissions is IERC165, ITraderControl {

    /**
     * @notice approval to mint
     */
    function approveToMint(address extension, address to, uint256 tokenId) external;
}