// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./access/TraderControl.sol";
import "./RAIR-ERC721Creator.sol";

/**
 * @notice ERC721Creator implementation
 */
abstract contract RAIR_ResaleManager is AdminControl, ERC721, RAIR_ERC721Creator {

    /**
     * @notice Check {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, RAIR_ERC721Creator, TraderControl) returns (bool) {
        return RAIR_ERC721Creator.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId) || TraderControl.supportsInterface(interfaceId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-resaleableRegister}.
     */
    function resaleableRegister(address extension, string calldata baseURI) external override virtual traderRequired nonResaleBlacklistRequired(extension) {
        _resaleableRegister(extension, baseURI, false);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-resaleableRegister}.
     */
    function resaleableRegister(address extension, string calldata baseURI, bool baseURIExtension) external override traderRequired nonResaleBlacklistRequired(extension) {
        _resaleableRegister(extension, baseURI, baseURIExtension);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-resaleableUnregister}.
     */
    function resaleableUnregister(address extension) external override traderRequired {
        _resaleableUnregister(extension);
    }



    /**
     * @notice Check {IRAIR_ResaleCreater-resaleableBlacklist}.
     */
    function resaleableBlacklist(address extension) external override traderRequired {
        _resaleableBlacklist(extension);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleTokenURIResaleable}.
     */
    function setResaleTokenURIResaleable(string calldata uri) external override extensionRequired {
        _setResaleTokenURIResaleable(uri, false);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleTokenURIResaleable}.
     */
    function setResaleTokenURIResaleable(string calldata uri, bool identical) external override extensionRequired {
        _setResaleTokenURIResaleable(uri, identical);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURIPrefixResaleable}.
     */
    function setTokenURIPrefixResaleable(string calldata prefix) external override extensionRequired {
        _setTokenURIPrefixResaleable(prefix);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURIResaleable}.
     */
    function setTokenURIResaleable(uint256 tokenId, string calldata uri) external override extensionRequired {
        _setTokenURIResaleable(tokenId, uri);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURIResaleable}.
     */
    function setTokenURIResaleable(uint256[] memory tokenIds, string[] calldata uris) external override virtual extensionRequired {
        require(tokenIds.length == uris.length, "Invalid input");
        for (uint i = 0; i < tokenIds.length; i++) {
            _setTokenURIResaleable(tokenIds[i], uris[i]);            
        }
    }


    /**
     * @notice Check {IRAIR_ERC721Creator-tokenResaleable}.
     */
    function tokenResaleable(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "Non-existent token");
        return _tokenResaleable(tokenId);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleableRoyalties}.
     */
    function setResaleableRoyalties(address extension, address payable[] calldata receivers, uint256[] calldata basisTokens) external override virtual traderRequired {
        _setResaleableRoyalties(extension, receivers, basisTokens);
    }
    
}