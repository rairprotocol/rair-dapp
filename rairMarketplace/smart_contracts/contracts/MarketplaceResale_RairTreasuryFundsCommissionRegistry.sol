// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IRAIR_ERC721_RairResaleRegistry.sol";
import "../interfaces/IRAIR_ERC721_ResaleAccessControls.sol";

contract MarketplaceResale_RairTreasuryFundsCommissionRegistry is IRAIR_ERC721_RairResaleRegistry {
    using SafeMath for uint256;

    IRAIR_ERC721_ResaleAccessControls public accessControls;

    address [] public treasuries;

    uint16 public maxTreasuryFundsCommission = 100000;

    // treasury address <> commision percentage
    mapping(address => uint16) public treasuryCommissionSplit;

    modifier isWhitelisted() {
        require(accessControls.isWhitelisted(msg.sender), "Caller not whitelisted");
        _;
    }

    constructor(IRAIR_ERC721_ResaleAccessControls _accessControls) public {
        accessControls = _accessControls;
    }

    function setTreasuryFundsCommissionSplits(uint256[] calldata _percentages, address[] calldata _treasuries) external isWhitelisted returns (bool) {
            require(_percentages.length == _treasuries.length, "Differing percentage or contractAddress sizes");

            // reset any existing splits
            for(uint256 i = 0; i < treasuries.length; i++) {
                address payable treasury = treasuries[i];
                delete treasuryCommissionSplit[treasury];
                delete treasuries[i];
            }
            treasuries.length = 0;

            uint256 total;
            
           for(uint256 i = 0; i < _treasuries.length; i++) {
               address payable treasury = _treasuries[i];
               require(treasury != address(0x0), "Invalid address");
               treasuries.push(treasury);
               treasuryCommissionSplit[treasury] = _percentages[i];
               total = total.add(_percentages[i]);
            }

            require(total == maxTreasuryFundsCommission, "Total commission does not match allowance");

            return true;
    }

    function getTreasuryFundsCommissionSplits() external view returns (uint256[] memory _percentages, address [] memory _treasuries) {
        require(treasuries.length > 0, "No treasuries have been registered");
        _percentages = new uint256[](treasuries.length);
        _treasuries = new address payable[](treasuries.length);

        for(uint256 i = 0; i < treasuries.length; i++) {
            address payable treasury = treasuries[i];
            _percentages[i] = treasuryCommissionSplit[treasury];
            _treasuries[i] = treasury;
        }
    }
    
    function getMaxTreasuryFundsCommission() external view returns (uint256) {
        return maxTreasuryFundsCommission;
    }
}