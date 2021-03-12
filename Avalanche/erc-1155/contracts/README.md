##ERC-1155 Set Up

* Run [remix IDE](remix.ethereum.org) online
* Go "Home" import all the sol file in this repo
* Open ERC1155Mintable.sol
* Click "SOLIDITY COMPILER" in left site and check compile with compiler setting 0.5.17+commit.d19bba13
* Set contract as ERC1155Mintable (ERC1155Mintable.sol)
* Click "DEPLOY & RUN TRANSACTIONS "
* Environment set as injected web3, account should match your metamask ID
* Set contract as ERC1155Mintablle 
* Click Depoly, and confirm transaction - confirm
* After transaction succuss, "ERC1155MINTABLE AT `0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942`(depends yours metamask account ID)BLOCKCHIAN"show up
    * you can also see create, mint, safeBatchTransferFrom, safeTransferFrom, setApprovalForAll, setURI, balanceOf, balanceOfBatch, creators, isApprovedForAll, nonce, supportsInterface
    * add below command into each function

example : 
```json
create : 
    "uint256_initialSupply" :  "0"
    "string _url" : " "

mint : 
    "uint256 _id" : " 1 " 
    "address[] _to" : " ["0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942"] "
    "uint256[] _quantities" : " [3] " 
    
balanceOf :
    "address_owner" : " 0x1EEBb16264D8BDB031685bEfF3d66bd6849F3942  "
    "uint256 _id" : " 1 " 

creators: : 
    "uint256" : " 1 "
```
