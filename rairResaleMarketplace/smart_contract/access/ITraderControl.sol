// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6; 

// Ueed on interfaces
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @notice Interface for admin control
 */
interface ITraderControl is IERC165 {


    event TraderApproved(address indexed account, address indexed sender);
    event TraderRevoked(address indexed account, address indexed sender);


    /**
     * @notice gets address of all traders
     */
    function getTrader() external view returns (address[] memory);



    /**
     * @notice add an trader role. Can only be called by contract owner.
     */
    function approveTrader(address trader) external;


    /**
     * @notice remove an trader role. Can only be called by contract owner.
     */
    function revokeTrader(address trader) external;


    /**
     * @notice checks whether or not given address is an trader role
     * Returns True if they are
     */
    function isTrader(address trader) external view returns (bool);


}