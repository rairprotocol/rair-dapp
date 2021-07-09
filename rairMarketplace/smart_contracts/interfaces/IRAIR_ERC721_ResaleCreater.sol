// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IRAIR_ERC721_ResaleCreater is IERC721 {
    function createResale (
        uint256 _copies,
        uint256 _creationDate,
        uint256 _price,
        uint256 _royalty,
        uint256 _title,
        address _contractAddress
    ) external returns (uint256 _tokenId);
}