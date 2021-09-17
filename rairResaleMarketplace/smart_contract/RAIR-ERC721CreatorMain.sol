// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./access/TraderControl.sol";
import "./RAIR-ERC721Creator.sol";
import "./RAIR-MintManager.sol";
import "./RAIR-ResaleManager.sol";

abstract contract RAIR_ERC721CreatorMain is TraderControl, ERC721, RAIR_ERC721CreatorMain {
    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, RAIR_ERC721CreatorMain, TraderControl) returns (bool) {
        return RAIR_ERC721CreatorMain.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId) || TraderControl.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
        _approveTransfer(from, to, tokenId);  
    }

    function resaleableRegister(address extension, string calldata baseURI) external override traderRequired nonResaleBlacklistRequired(extension) {
        _resaleableRegister(extension, baseURI, false);
    }

    function resaleableRegister(address extension, string calldata baseURI, bool baseURIExtension) external override traderRequired nonResaleBlacklistRequired(extension) {
        _resaleableRegister(extension, baseURI, baseURIExtension);
    }

    function resaleableUnregister(address extension) external override traderRequired {
        _resaleableUnregister(extension);
    }

    function resaleableBlacklist(address extension) external override traderRequired {
        _resaleableBlacklist(extension);
    }

    function setResaleTokenURIResaleable(string calldata uri) external override extensionRequired {
        _setResaleTokenURIResaleable(uri, false);
    }

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
    function setTokenURIResaleable(uint256[] memory tokenIds, string[] calldata uris) external override extensionRequired {
        require(tokenIds.length == uris.length, "Invalid input");
        for (uint i = 0; i < tokenIds.length; i++) {
            _setTokenURIResaleable(tokenIds[i], uris[i]);            
        }
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleTokenURI}.
     */
    function setResaleTokenURI(string calldata uri) external override traderRequired {
        _setResaleTokenURI(uri);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURIPrefix}.
     */
    function setTokenURIPrefix(string calldata prefix) external override traderRequired {
        _setTokenURIPrefix(prefix);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string calldata uri) external override traderRequired {
        _setTokenURI(tokenId, uri);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setTokenURI}.
     */
    function setTokenURI(uint256[] memory tokenIds, string[] calldata uris) external override traderRequired {
        require(tokenIds.length == uris.length, "Invalid input");
        for (uint i = 0; i < tokenIds.length; i++) {
            _setTokenURI(tokenIds[i], uris[i]);            
        }
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setMintPermissions}.
     */
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
     * @dev Check {IRAIR_ERC721Creator-resaleableMint}.
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
     * @notice Check {IRAIR_ERC721Creator-tokenResaleable}.
     */
    function tokenResaleable(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "Non-existent token");
        return _tokenResaleable(tokenId);
    }


    /**
     * @dev Check {IRAIR_ERC721Creator-burn}.
     */
    function burn(uint256 tokenId) public virtual override nonReentrant {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
        address owner = ownerOf(tokenId);
        _burn(tokenId);
        _postBurn(owner, tokenId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setRoyalties}.
     */
    function setRoyalties(address payable[] calldata receivers, uint256[] calldata basisTokens) external override traderRequired {
        _setResaleableRoyalties(address(this), receivers, basisTokens);
    }



    /**
     * @notice Check {IRAIR_ResaleCreater-setRoyalties}.
     */
    function setRoyalties(uint256 tokenId, address payable[] calldata receivers, uint256[] calldata basisTokens) external override traderRequired {
        require(_exists(tokenId), "Non-existent token");
        _setRoyalties(tokenId, receivers, basisTokens);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleableRoyalties}.
     */
    function setResaleableRoyalties(address extension, address payable[] calldata receivers, uint256[] calldata basisTokens) external override traderRequired {
        _setResaleableRoyalties(extension, receivers, basisTokens);
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-getRoyalties}.
     */
    function getRoyalties(uint256 tokenId) external view virtual override returns (address payable[] memory, uint256[] memory) {
        require(_exists(tokenId), "Non-existent token");
        return _getRoyalties(tokenId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-getFees}.
     */
    function getFees(uint256 tokenId) external view virtual override returns (address payable[] memory, uint256[] memory) {
        require(_exists(tokenId), "Non-existent token");
        return _getRoyalties(tokenId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-getFeeRecipients}.
     */
    function getFeeRecipients(uint256 tokenId) external view virtual override returns (address payable[] memory) {
        require(_exists(tokenId), "Non-existent token");
        return _getRoyaltyReceivers(tokenId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-getFeeBps}.
     */
    function getFeeBps(uint256 tokenId) external view virtual override returns (uint[] memory) {
        require(_exists(tokenId), "Non-existent token");
        return _getRoyaltyBPS(tokenId);
    }
    
    /**
     * @notice Check {IRAIR_ResaleCreater-royaltyInfo}.
     */
    function royaltyInfo(uint256 tokenId, uint256 value) external view virtual override returns (address, uint256) {
        require(_exists(tokenId), "Non-existent token");
        return _getRoyaltyInfo(tokenId, value);
    } 

    /**
     * @notice Check {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Non-existent token");
        return _tokenURI(tokenId);
    }
    
}