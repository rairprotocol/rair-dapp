// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6; 


import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Used on interfaces
import "./ITraderControl.sol";

abstract contract TraderControl is Ownable, ITraderControl, ERC165 {
    
    using EnumerableSet for EnumerableSet.AddressSet;

    // Declare a Trader state variable
    EnumerableSet.AddressSet private _traders;

    /**
     * @notice Check {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(ITraderControl).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @notice Only allows approved trader to call the specified function
     */
    modifier traderRequired() {
        require(owner() == msg.sender || _traders.contains(msg.sender), "TraderControl: Must be owner or trader");
        _;
    }

    /**
     * @notice Check {ITraderControl-getTraders}.
     */
    function getTraders() external view override returns (address[] memory traders) {
        traders = new address[](_traders.length());
        for (uint i = 0; i < _traders.length(); i++) {
            traders[i] = _traders.at(i);
        }
        return traders;
    }

    /**
     * @notice Check {ITraderControl-approveTrader}.
     */
    function approveTrader(address trader) external override onlyOwner {
        if (!_traders.contains(trader)) {
            emit TraderApproved(trader, msg.sender);
            _traders.add(trader);
        }
    }

    /**
     * @notice Check {ITraderControl-revokeTrader}.
     */
    function revokeTrader(address trader) external override onlyOwner {
        if (_traders.contains(trader)) {
            emit TraderRevoked(trader, msg.sender);
            _traders.remove(trader);
        }
    }


    /**
     * @notice Check {ITraderControl-isTrader}.
     */
    function isTrader(address trader) public override view returns (bool) {
        return (owner() == trader || _traders.contains(trader));
    }


}