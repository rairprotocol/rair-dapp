// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

contract Test721 is ERC721Enumerable {      
    // name and symbol
    constructor() ERC721("testNFT", "TNT") {
    }
    function mint(address recipient, uint256 tokenId, 
    string memory tokenURI) public {        
		_safeMint(recipient, tokenId);   
    }
}