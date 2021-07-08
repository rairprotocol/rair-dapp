// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IRAIR_ERC721_RairResaleRegistry is IERC721{
    function getTreasuryFundsCommissionSplits() external view returns (uint256[] memory _percentages, address [] memory _treasuries);
    function getMaxTreasuryFundsCommission() external view returns (uint256);
}