// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4; 



import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./token/extensions/IRAIR-ResaleCreaterApproveTransfer.sol";
import "./token/extensions/IRAIR-ResaleCreaterBurnable.sol";
import "./permissions/IRAIR-ERC721CreatorMintPermissions.sol";
import "./IRAIR-ERC721Creator.sol";
import "./RAIR-ResaleCreater.sol";

/**
 * @notice ERC721 creator implementation
 */
abstract contract RAIR_ERC721Creator is RAIR_ResaleCreater, IRAIR_ERC721Creator {

    using EnumerableSet for EnumerableSet.AddressSet;

    /**
     * @notice Check {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(RAIR_ResaleCreater, IERC165) returns (bool) {
        return interfaceId == type(IRAIR_ERC721Creator).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @notice Check {IRAIR_ResaleCreater-setResaleableApproveTransfer}.
     */
    function setResaleableApproveTransfer(bool enabled) external override ResaleableRequired {
        require(!enabled || ERC165Checker.supportsInterface(msg.sender, type(IRAIR-ResaleCreaterApproveTransfer).interfaceId), "RAIR_ERC721Creator: Requires extension to implement IERC721CreatorExtensionApproveTransfer");
        if (_resaleableApproveTransfers[msg.sender] != enabled) {
            _resaleableApproveTransfers[msg.sender] = enabled;
            emit ResaleableUpdatedApproveTransfer(msg.sender, enabled);
        }
    }

    /**
     * @notice Set mint permissions for an extension
     */
    function _setMintPermissions(address extension, address permissions) internal {
        require(_resaleables.contains(extension), "RAIR_ResaleCreater: Invalid extension");
        require(permissions == address(0x0) || ERC165Checker.supportsInterface(permissions, type(IRAIR-ERC721CreatorMintPermissions).interfaceId), "RAIR_ERC721Creator: Invalid address");
        if (_resaleablePermissions[extension] != permissions) {
            _resaleablePermissions[extension] = permissions;
            emit UpdatedMintPermissions(extension, permissions, msg.sender);
        }
    }

    /**
     * Check if an extension can mint
     */
    function _checkMintPermissions(address to, uint256 tokenId) internal {
        if (_resaleablePermissions[msg.sender] != address(0x0)) {
            IRAIR-ERC721CreatorMintPermissions(_resaleablePermissions[msg.sender]).approveToMint(msg.sender, to, tokenId);
        }
    }


    /**
     * Override for post mint actions
     */
    function _postEasyMint(address, uint256) internal virtual {}

    
    /**
     * Override for post mint actions
     */
    function _postResaleableMint(address, uint256) internal virtual {}


    /**
     * Post-burning callback and metadata cleanup
     */
    function _postBurn(address owner, uint256 tokenId) internal virtual {
        // Callback to originating extension if needed
        if (_resaleableTokens[tokenId] != address(this)) {
           if (ERC165Checker.supportsInterface(_resaleableTokens[tokenId], type(IRAIR-ResaleCreaterBurnable).interfaceId)) {
               IRAIR_ResaleCreaterBurnable(_resaleableTokens[tokenId]).onBurn(owner, tokenId);
           }
        }
        // Clear metadata (if any)
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }    
        // Delete token origin extension tracking
        delete _resaleableTokens[tokenId];    
    }


    /**
     * Approve a transfer
     */
    function _approveTransfer(address from, address to, uint256 tokenId) internal {
       if (_resaleableApproveTransfers[_resaleableTokens[tokenId]]) {
           require(IRAIR_ResaleCreaterApproveTransfer(_resaleableTokens[tokenId]).approveTransfer(from, to, tokenId), "RAIR_ERC721CreatorMain: Extension approval failure");
       }
    }

}