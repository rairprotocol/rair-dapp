// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./token/extensions/IRAIR-ResaleCreaterExtension.sol";
import "./token/extensions/IRAIR-ResaleCreaterExtensionTokenURI.sol";

import "./IRAIR-ResaleCreater.sol";

/**
 * @notice Core creator implementation
 */
abstract contract RAIR_ResaleCreater is ReentrancyGuard, IRAIR_ResaleCreater, ERC165 {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 _tokenCount = 0;

    // Track registered extensions data
    EnumerableSet.AddressSet internal _resaleables;
    EnumerableSet.AddressSet internal _resaleableBlacklisted;

    mapping (address => address) internal _resaleablePermissions;
    mapping (address => bool) internal _resaleableApproveTransfers;

    
    // For tracking which extension a token was minted by
    mapping (uint256 => address) internal _resaleableTokens;



    // The baseURI for a given extension
    mapping (address => string) private _resaleableBaseURI;
    mapping (address => bool) private _resaleableBaseURIExtension; 


    // The prefix for any tokens with a uri configured
    mapping (address => string) private _resaleableURIPrefix;


    // Mapping for individual token URIs
    mapping (uint256 => string) internal _tokenURIs;

    
    // Royalty configurations
    mapping (address => address payable[]) internal _resaleableRoyaltyReceivers;
    mapping (address => uint256[]) internal _resaleableRoyaltyBPS;


    mapping (uint256 => address payable[]) internal _tokenRoyaltyReceivers;
    mapping (uint256 => uint256[]) internal _tokenRoyaltyBPS;

    /**
     * External interface identifier of the royalty
     */

    /**
     *  @notice ResaleCreater
     *
     *  bytes4(keccak256('getRoyalties(uint256)')) == 0xbb3bafd6
     *
     */
    bytes4 private constant _INTERFACE_ID_ROYALTIES_RESALECREATER = 0xbb3bafd6;
    
    /**
     *  @notice EIP-2981
     *
     * bytes4(keccak256("royaltyInfo(uint256,uint256,bytes)")) == 0x6057361d
     *
     */
    bytes4 private constant _INTERFACE_ID_ROYALTIES_EIP2981 = 0x6057361d;

    /**
     * @notice Check {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IRAIR-ResaleCreater).interfaceId || super.supportsInterface(interfaceId)
            || interfaceId == _INTERFACE_ID_ROYALTIES_CREATORCORE || interfaceId == _INTERFACE_ID_ROYALTIES_EIP2981;
    }


    /**
     * @notice Only allows registered extensions to call the specified function
     */
    modifier extensionRequired() {
        require(_resaleables.contains(msg.sender), "RAIR_ResaleCreater: Must be registered extension");
        _;
    }


    /**
     * @notice Only allows non-blacklisted extensions
     */
    modifier nonResaleBlacklistRequired(address extension) {
        require(!_blacklistedExtensions.contains(extension), "RAIR_ResaleCreater: Extension blacklisted");
        _;
    }


    /**
     * @notice Check {IRAIR_ResaleCreater-getResaleable}.
     */
    function getResaleable() external view override returns (address[] memory extensions) {
        extensions = new address[](_resaleables.length());
        for (uint i = 0; i < _resaleables.length(); i++) {
            extensions[i] = _resaleables.at(i);
        }
        return extensions;
    }


    /**
     * @notice Register an extension
     */
    function _resaleableRegister(address extension, string calldata baseURI, bool baseURIExtension) internal {
        require(ERC165Checker.supportsInterface(extension, type(IRAIR_ResaleCreaterExtensionBase).interfaceId), "Creator: Extension must implement IRAIR_ResaleCreaterExtensionBase");
        if (!_resaleables.contains(extension)) {
            _resaleableBaseURI[extension] = baseURI;
            _resaleableBaseURIExtension[extension] = baseURIExtension;
            emit ResaleableRegistered(extension, msg.sender);
            _resaleables.add(extension);
        }
    }


    /**
     * @notice Unregister an extension
     */
    function _resaleableUnregister(address extension) internal {
       if (_resaleables.contains(extension)) {
           emit ResaleableUnregistered(extension, msg.sender);
           _resaleables.remove(extension);
       }
    }

    /**
     * @notice Blacklist an extension
     */
    function _resaleableBlacklist(address extension) internal {
       require(extension != address(this), "RAIR_ResaleCreater: Cannot blacklist yourself");
       if (_resaleables.contains(extension)) {
           emit ResaleableUnregistered(extension, msg.sender);
           _resaleables.remove(extension);
       }
       if (!_resaleableBlacklisted.contains(extension)) {
           emit ResaleableBlacklisted(extension, msg.sender);
           _resaleableBlacklisted.add(extension);
       }
    }


    /**
     * @notice Set base token uri for an extension
     */
    function _setResaleTokenURIResaleable(string calldata uri, bool identical) internal {
        _resaleableBaseURI[msg.sender] = uri;
        _resaleableBaseURIExtension[msg.sender] = identical;
    }

    /**
     * @notice Set token uri prefix for an extension
     */
    function _setTokenURIPrefixResaleable(string calldata prefix) internal {
        _resaleableURIPrefix[msg.sender] = prefix;
    }

    /**
     * @notice Set token uri for a token of an extension
     */
    function _setTokenURIResaleable(uint256 tokenId, string calldata uri) internal {
        require(_resaleableTokens[tokenId] == msg.sender, "RAIR_ResaleCreater: Invalid token");
        _tokenURIs[tokenId] = uri;
    }


    /**
     * @notice Set base token uri for tokens with no extension
     */
    function _setResaleTokenURI(string calldata uri) internal {
        _resaleableBaseURI[address(this)] = uri;
    }

    /**
     * @notice Set token uri prefix for tokens with no extension
     */
    function _setTokenURIPrefix(string calldata prefix) internal {
        _resaleableURIPrefix[address(this)] = prefix;
    }


    /**
     * @notice Set token uri for a token with no extension
     */
    function _setTokenURI(uint256 tokenId, string calldata uri) internal {
        require(_resaleableTokens[tokenId] == address(this), "RAIR_ResaleCreater: Invalid token");
        _tokenURIs[tokenId] = uri;
    }


    /**
     * @notice Retrieve a token's URI
     */
    function _tokenURI(uint256 tokenId) internal view returns (string memory) {
        address extension = _resaleableTokens[tokenId];
        require(!_resaleableBlacklisted.contains(extension), "RAIR_ResaleCreater: Extension blacklisted");

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            if (bytes(_resaleableURIPrefix[extension]).length != 0) {
                return string(abi.encodePacked(_resaleableURIPrefix[extension],_tokenURIs[tokenId]));
            }
            return _tokenURIs[tokenId];
        }

        if (ERC165Checker.supportsInterface(extension, type(IRAIR_ResaleCreaterExtensionTokenURI).interfaceId)) {
            return IRAIR_ResaleCreaterExtensionTokenURI(extension).tokenURI(address(this), tokenId);
        }

        if (!_resaleableBaseURIExtension[extension]) {
            return string(abi.encodePacked(_resaleableBaseURI[extension], tokenId.toString()));
        } else {
            return _resaleableBaseURI[extension];
        }
    }

    /**
     * Get token extension for resale
     */
    function _tokenResaleable(uint256 tokenId) internal view returns (address extension) {
        extension = _resaleableTokens[tokenId];

        require(extension != address(this), "RAIR_ResaleCreater: No extension for token");
        require(!_blacklistedExtensions.contains(extension), "RAIR_ResaleCreater: Extension blacklisted");

        return extension;
    }


    /**
     * Get royalties for a token
     */
    function _getRoyalties(uint256 tokenId) view internal returns (address payable[] storage, uint256[] storage) {
        return (_getRoyaltyReceivers(tokenId), _getRoyaltyBPS(tokenId));
    }


    /**
     * Helper to get royalty receivers for a token
     */
    function _getRoyaltyReceivers(uint256 tokenId) view internal returns (address payable[] storage) {
        if (_tokenRoyaltyReceivers[tokenId].length > 0) {
            return _tokenRoyaltyReceivers[tokenId];
        } else if (_resaleableRoyaltyReceivers[_resaleableTokens[tokenId]].length > 0) {
            return _resaleableRoyaltyReceivers[_resaleableTokens[tokenId]];
        }
        return _resaleableRoyaltyReceivers[address(this)];
    }


    /**
     * Helper to get royalty basis points for a token
     */
    function _getRoyaltyBPS(uint256 tokenId) view internal returns (uint256[] storage) {
        if (_tokenRoyaltyBPS[tokenId].length > 0) {
            return _tokenRoyaltyBPS[tokenId];
        } else if (_resaleableRoyaltyBPS[_resaleableTokens[tokenId]].length > 0) {
            return _resaleableRoyaltyBPS[_resaleableTokens[tokenId]];
        }
        return _resaleableRoyaltyBPS[address(this)];        
    }


    function _getRoyaltyInfo(uint256 tokenId, uint256 value) view internal returns (address receiver, uint256 amount, bytes memory data){
        address payable[] storage receivers = _getRoyaltyReceivers(tokenId);
        require(receivers.length <= 1, "RAIR_ResaleCreater: Only works if there are at most 1 royalty receivers");
        
        if (receivers.length == 0) {
            return (address(this), 0, data);
        }
        return (receivers[0], _getRoyaltyBPS(tokenId)[0]*value/10000, data);
    }


    /**
     * Helper to shorten royalties arrays if it is too long
     */
    function _shortenRoyalties(address payable[] storage receivers, uint256[] storage basisTokens, uint256 targetLength) internal {
        require(receivers.length == basisTokens.length, "RAIR_ResaleCreater: Invalid input");
        if (targetLength < receivers.length) {
            for (uint i = receivers.length; i > targetLength; i--) {
                receivers.pop();
                basisTokens.pop();
            }
        }
    }


    /**
     * update royalites
     */
    function _updateRoyalties(address payable[] storage receivers, uint256[] storage basisTokens, address payable[] calldata newReceivers, uint256[] calldata newBPS) internal {
        require(receivers.length == basisTokens.length, "RAIR_ResaleCreater: Invalid input");
        require(newReceivers.length == newBPS.length, "RAIR_ResaleCreater: Invalid input");
        uint256 totalRoyalties;
        for (uint i = 0; i < newReceivers.length; i++) {
            if (i < receivers.length) {
                receivers[i] = newReceivers[i];
                basisTokens[i] = newBPS[i];
            } else {
                receivers.push(newReceivers[i]);
                basisTokens.push(newBPS[i]);
            }
            totalRoyalties += newBPS[i];
        }
        require(totalRoyalties < 10000, "RAIR_ResaleCreater: Invalid total royalties");
    }


    /**
     * Set royalties for a token
     */
    function _setRoyalties(uint256 tokenId, address payable[] calldata receivers, uint256[] calldata basisTokens) internal {
        require(receivers.length == basisTokens.length, "RAIR_ResaleCreater: Invalid input");
        _shortenRoyalties(_tokenRoyaltyReceivers[tokenId], _tokenRoyaltyBPS[tokenId], receivers.length);
        _updateRoyalties(_tokenRoyaltyReceivers[tokenId], _tokenRoyaltyBPS[tokenId], receivers, basisTokens);
        emit RoyaltiesUpdated(tokenId, receivers, basisTokens);
    }


    /**
     * Set royalties for all tokens of an resale extension
     */
    function _setResaleableRoyalties(address extension, address payable[] calldata receivers, uint256[] calldata basisTokens) internal {
        require(receivers.length == basisTokens.length, "RAIR_ResaleCreater: Invalid input");
        _shortenRoyalties(_resaleableRoyaltyReceivers[extension], _resaleableRoyaltyBPS[extension], receivers.length);
        _updateRoyalties(_resaleableRoyaltyReceivers[extension], _resaleableRoyaltyBPS[extension], receivers, basisTokens);
        if (extension == address(this)) {
            emit DefaultRoyaltiesUpdated(receivers, basisTokens);
        } else {
            emit ResaleableUpdatedRoyalties(extension, receivers, basisTokens);
        }
    }


}