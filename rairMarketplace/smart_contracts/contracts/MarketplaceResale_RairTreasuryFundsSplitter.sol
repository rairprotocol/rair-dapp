// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IRAIR_ERC721_RairResaleRegistry.sol";

contract MarketplaceResale_RairTreasuryFundsSplitter {
    using SafeMath for uint256;

    event TreasuryFundsSplitAndTransferred(uint256 _totalValue, address payable _contractAddress);

    IRAIR_ERC721_RairResaleRegistry public RairResaleRegistry;

    constructor(IRAIR_ERC721_RairResaleRegistry _RairResaleRegistry) public {
        RairResaleRegistry = _RairResaleRegistry;
    }

    function() external payable {
        (uint256[] memory _percentages, address payable[] memory _treasuries) = treasuryCommissionRegistry.getCommissionSplits();
        require(_percentages.length > 0, "No treasury funds commissions is found");

        uint256 mod = RairResaleRegistry.getMaxTreasuryFundsCommission();

        for (uint256 i = 0; i < _percentages.length; i++) {
            uint256 percentage = _percentages[i];
            address payable treasury = _treasuries[i];
        

        uint256 valueSend = msg.value.div(mod).mul(percentage);
        (bool success, ) = treasury.call.value(valueSend)("");
        require(success, "Transfer is failed");
        
        emit TreasuryFundsSplitAndTransferred(valueSend, treasury);
        }
    }
}