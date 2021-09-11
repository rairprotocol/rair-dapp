// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7; 

// Used on interfaces
import "./IRAIR-ERC721Creator.sol";
import "./token/extensions/IRAIR-ResaleCreaterExtension.sol";
import "./token/extensions/IRAIR-ResaleCreaterBurnable.sol";

// Parent classes
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";


contract RAIRTest is Ownable, ERC165 {
    address private _creator;
    uint256 public treasuryCount = 0;
    uint256 public treasuryLimit = 3;
    event ResaleMarketplaceLaunched(address indexed _receiver, uint256 indexed _tokenID);
    event LaunchFailure(address indexed _caller);
    event ResaleMarketplaceBurned(address indexed _receiver, uint256 indexed _tokenID);

    constructor(address creator) {
        _creator = creator;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IRAIR-ResaleCreaterExtension).interfaceId || type(IRAIR-ResaleCreaterBurnable).interfaceId || super.supportsInterface(interfaceId);
    }

    function launch(address receiver, string calldata uri) external onlyOwner {
        if (treasuryCount < treasuryLimit) {
            treasuryCount++;
            IRAIR_ERC721Creator(0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942).resaleableMint(receiver,uri);
            emit ResaleMarketplaceLaunched(receiver, treasuryCount);
        } else {
            emit LaunchFailure(receiver);
        }
    }

    function burn(uint256 tokenId) external {
        IRAIR_ERC721Creator(0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942).burn(tokenId);
        treasuryCount--;
        emit ResaleMarketplaceBurned(msg.sender, tokenId);
    }

    function setResaleTokenURI(string calldata uri, bool identical) external onlyOwner {
        IRAIR_ERC721Creator(0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942).setResaleTokenURIResaleable(uri, identical);
    }

    function setTokenURI(uint256[] calldata tokenIds, string[] calldata uris) external onlyOwner {
        IRAIR_ERC721Creator(0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942).setTokenURIResaleable(tokenIds, uris);
    }    

    function setTokenURIPrefix(string calldata prefix) external onlyOwner {
        IRAIR_ERC721Creator(0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942).setTokenURIPrefixResaleable(prefix);
    }
}