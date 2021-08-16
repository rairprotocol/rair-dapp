pragma solidity ^0.4.23; 

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract PEPE is ERC721Token("RAIR PEPE", "PEPE"), Ownable { 
  
  mapping(uint => string) tokenToIpfsHash; 
  mapping(string => uint) ipfsHashToToken; 
  mapping(uint => uint) tokenToPrice; 

  function mint(string ipfsHash, uint price) public payable onlyOwner { 
    require(ipfsHashToToken[ipfsHash] == 0);

    uint newTokenId = totalSupply().add(1);
    
    ipfsHashToToken[ipfsHash] = newTokenId;
    tokenToIpfsHash[newTokenId] = ipfsHash;
    tokenToPrice[newTokenId] = price; 
    
    _mint(address(this), newTokenId);
  }

  function getIpfsHash(uint _tokenId) public view returns(string) { 
    return tokenToIpfsHash[_tokenId];
  }

  function buyRAIR(uint _tokenId) public payable { 
    require(ownerOf(_tokenId) == address(this));
    require(msg.value >= tokenToPrice[_tokenId]);
    
    clearApproval( address(this), _tokenId);
    removeTokenFrom( address(this), _tokenId);
    addTokenTo(msg.sender, _tokenId);

    emit Transfer(address(this), msg.sender, _tokenId);
  }

  function tokensOf(address _owner) public view returns(uint[]) { 
    require(_owner != address(0));
    return ownedTokens[_owner];
  }
}
