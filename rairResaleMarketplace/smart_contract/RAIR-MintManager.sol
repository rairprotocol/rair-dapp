// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./access/TraderControl.sol";
import "./RAIR-ERC721Creator.sol";

/**
 * @dev MintManager implementation
 */
abstract contract RAIR_MintManager is TraderControl, ERC721, RAIR_ERC721Creator, Pausable {

    /**
     * @notice Check {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, RAIR_ERC721Creator, TraderControl) returns (bool) {
        return RAIR_ERC721Creator.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId) || TraderControl.supportsInterface(interfaceId);
    }

    function setMintPermissions(address extension, address permissions) external override traderRequired {
        _setMintPermissions(extension, permissions);
    }

    /**
     * @notice Check {IRAIR_ERC721Creator-easyMint}.
     */
    function easyMint(address to) public virtual override nonReentrant traderRequired returns(uint256) {
        return _easyMint(to, "");
    }

    /**
     * @notice Check {IRAIR_ERC721Creator-easyMint}.
     */
    function easyMint(address to, string calldata uri) public virtual override nonReentrant traderRequired returns(uint256) {
        return _easyMint(to, uri);
    }


    /**
     * @notice Mint token with no extension
     */
    function _easyMint(address to, string memory uri) internal virtual returns(uint256 tokenId) {
        _tokenCount++;
        tokenId = _tokenCount;

        // Track the extension that minted the token
        _resaleableTokens[tokenId] = address(this);

        _safeMint(to, tokenId);

        if (bytes(uri).length > 0) {
            _tokenURIs[tokenId] = uri;
        }

        // Call post mint
        _postEasyMint(to, tokenId);
        return tokenId;
    }


    /**
     * @notice Check {IRAIR_ERC721Creator-resaleableMint}.
     */
    function resaleableMint(address to) public virtual override nonReentrant extensionRequired returns(uint256) {
        return _resaleableMint(to, "");
    }

    /**
     * @notice Check {IRAIR_ERC721Creator-resaleableMint}.
     */
    function resaleableMint(address to, string calldata uri) public virtual override nonReentrant extensionRequired returns(uint256) {
        return _resaleableMint(to, uri);
    }
    
    /**
     * @notice Mint token via extension
     */
    function _resaleableMint(address to, string memory uri) internal virtual returns(uint256 tokenId) {
        _tokenCount++;
        tokenId = _tokenCount;

        _checkMintPermissions(to, tokenId);

        // Track the extension that minted the token
        _resaleableTokens[tokenId] = msg.sender;

        _safeMint(to, tokenId);

        if (bytes(uri).length > 0) {
            _tokenURIs[tokenId] = uri;
        }
        
        // Call post mint
        _postResaleableMint(to, tokenId);
        return tokenId;
    }


    /**
     * @notice Check {IRAIR_ERC721Creator-burn}.
     */
    function burn(uint256 tokenId) public virtual override nonReentrant {
        require(_isApprovedOrOwner(msg.sender, tokenId), "caller is not owner nor approved");
        address owner = ownerOf(tokenId);
        _burn(tokenId);
        _postBurn(owner, tokenId);
    }

    function pause() public virtual override nonReentrant traderRequired {
        _pause();
    }

    function unpause() public virtual override nonReentrant traderRequired {
        _unpause();
    }
    
}