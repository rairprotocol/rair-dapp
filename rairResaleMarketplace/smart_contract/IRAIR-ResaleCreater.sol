// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/String.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./token/extensions/IRAIR-ResaleCreaterExtension.sol";
import "./token/extensions/IRAIR-ResaleCreaterExtensionTokenURI.sol";


import "./IRAIR-ResaleCreater.sol";


/**
 * @dev Core interface - ResaleCreater
 */
interface IRAIR_ResaleCreater is IERC165 {

    event ResaleableRegistered(address indexed extension, address indexed sender);

    event ResaleableUnregistered(address indexed extension, address indexed sender);

    event ResaleableBlacklisted(address indexed extension, address indexed sender);

    event MintPermissionsUpdated(address indexed extension, address indexed permissions, address indexed sender);

    event UpdatedRoyalties(uint256 indexed tokenId, address payable[] receivers, uint256[] basisTokens);

    event DefaultUpdatedRoyalties(address payable[] receivers, uint256[] basisTokens);

    event ResaleableUpdatedRoyalties(address indexed extension, address payable[] receivers, uint256[] basisTokens);

    event ResaleableUpdatedApproveTransfer(address indexed extension, bool enabled);


    /**
     * @notice gets address of all extensions
     */
    function getResaleable() external view returns (address[] memory);


    /**
     * @notice add an extension.  Can only be called by contract owner or trader.
     * extension address must point to a contract implementing IRAIR-ResaleCreater Extension.
     * Returns True if newly added, False if already added.
     */
    function resaleableRegister(address extension, string calldata baseURI) external;



    /**
     * @notice add an extension.  Can only be called by contract owner or trader.
     * extension address must point to a contract implementing IRAIR-ResaleCreater Extension.
     * Returns True if newly added, False if already added.
     */
    function resaleableRegister(address extension, string calldata baseURI, bool baseURIExtension) external;



    /**
     * @notice add an extension.  Can only be called by contract owner or trader.
     * Returns True if removed, False if already removed.
     */
    function resaleableUnregister(address extension) external;


    /**
     * @notice blacklist an extension.  Can only be called by contract owner or trader.
     * This function will destroy all ability to reference the metadata of any tokens created
     * by the specified extension. It will also unregister the extension if needed.
     * Returns True if removed, False if already removed.
     */
    function resaleableBlacklist(address extension) external;


    /**
     * @notice set the baseTokenURI of an extension. Can only be called by extension.
     */
    function setResaleTokenURIResaleable(string calldata uri) external;


    /**
     * @notice set the baseTokenURI of an extension. Can only be called by extension.
     * For tokens with no uri configured, tokenURI will return "uri+tokenId"
     */
    function setResaleTokenURIResaleable(string calldata uri, bool identical) external;


    /**
     * @notice set the common prefix of an extension. Can only be called by extension.
     * If configured, and a token has a uri set, tokenURI will return "commonURI+tokenURI"
     * Useful if you want to use ipfs/arweave
     */
    function setTokenURIPrefixResaleable(string calldata prefix) external;



    /**
     * @notice set the tokenURI of a token extension. Can only be called by extension that minted token.
     */
    function setTokenURIResaleable(uint256 tokenId, string calldata uri) external;



    /**
     * @notice set the tokenURI of a token extension for multiple tokens. Can only be called by extension that minted token.
     */
    function setTokenURIResaleable(uint256[] memory tokenId, string[] calldata uri) external;


    /**
     * @notice set the baseTokenURI for tokens with no extension. Can only be called by owner/trader.
     * For tokens with no uri configured, tokenURI will return "uri+tokenId"
     */
    function setResaleTokenURI(string calldata uri) external;



    /**
     * @notice set the common prefix for tokens with no extension. Can only be called by owner/trader.
     * If configured, and a token has a uri set, tokenURI will return "commonURI+tokenURI"
     * Useful if you want to use ipfs/arweave
     */
    function setTokenURIPrefix(string calldata prefix) external;


    /**
     * @notice set the tokenURI of a token with no extension. Can only be called by owner/trader.
     */
    function setTokenURI(uint256 tokenId, string calldata uri) external;


    /**
     * @notice set the tokenURI of multiple tokens with no extension. Can only be called by owner/trader.
     */
    function setTokenURI(uint256[] memory tokenIds, string[] calldata uris) external;

    /**
     * @notice set a permissions contract for an extension.  Used to control minting.
     */
    function setMintPermissions(address extension, address permissions) external;

    /**
     * @notice Configure so transfers of tokens created by the caller (must be extension) gets approval
     * from the extension before transferring
     */
    function setResaleableApproveTransfer(bool enabled) external;



    /**
     * @notice get the extension of a given token
     */
    function tokenResaleable(uint256 tokenId) external view returns (address);


    /**
     * @notice Set default royalties
     */
    function setRoyalties(address payable[] calldata receivers, uint256[] calldata basisTokens) external;

    /**
     * @notice Set royalties of a token
     */
    function setRoyalties(uint256 tokenId, address payable[] calldata receivers, uint256[] calldata basisTokens) external;

    /**
     * @notice Set royalties of an extension
     */
    function setResaleableRoyalties(address extension, address payable[] calldata receivers, uint256[] calldata basisTokens) external;


    /**
     * @notice Get royalites of a token.  Returns list of receivers and basisTokens
     */
    function getRoyalties(uint256 tokenId) external view returns (address payable[] memory, uint256[] memory);
    
    // Royalty support for various other standards
    function getFeeRecipients(uint256 tokenId) external view returns (address payable[] memory);
    function getFeeBps(uint256 tokenId) external view returns (uint[] memory);
    function getFees(uint256 tokenId) external view returns (address payable[] memory, uint256[] memory);
    function royaltyInfo(uint256 tokenId, uint256 value, bytes calldata data) external view returns (address, uint256, bytes memory);

}