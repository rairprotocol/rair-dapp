pragma solidity ^0.5.0;

import "./DelegatesStorage.sol";

///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @title ERCXXXXReceiverDelegate
 * @dev Contract to test safe transfer behavior via proxy with future standard delegate.
 */
///////////////////////////////////////////////////////////////////////////////////////////////////

contract ERCXXXXReceiverDelegate is ProxyReceiverStorage_002_ERCXXXXFuture {

    bytes4 constant public ERCXXXX_RECEIVED = 0x1234AAAA;
    bytes4 constant public ERCXXXX_BATCH_RECEIVED = 0x4321BBBB;
    bytes4 constant public NOT_ERCXXXX_RECEIVED = 0xDEADF00D; // Some random value

    function setShouldRejectClash(bool _value) external {
        require(address(this) == proxy, "Direct call: setShouldRejectClash");

        shouldReject = _value;
    }

    function setShouldRejectXXXX(bool _value) external {
        require(address(this) == proxy, "Direct call: setShouldRejectXXXX");

        shouldRejectXXXX = _value;
    }

    function onERCXXXXReceived(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external view returns(bytes4) {
        (_operator); (_from); (_id); (_value); (_data);  // solidity, be quiet please

        require(address(this) == proxy, "Direct call: onERCXXXXReceived");

        if (shouldRejectXXXX == true) {
            return NOT_ERCXXXX_RECEIVED;
        } else {
            return ERCXXXX_RECEIVED;
        }
    }

    function onERCXXXXBatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external view returns(bytes4) {
        (_operator); (_from); (_ids); (_values); (_data);  // solidity, be quiet please

        require(address(this) == proxy, "Direct call: onERCXXXXBatchReceived");

        if (shouldRejectXXXX == true) {
            return NOT_ERCXXXX_RECEIVED;
        } else {
            return ERCXXXX_BATCH_RECEIVED;
        }
    }
}
