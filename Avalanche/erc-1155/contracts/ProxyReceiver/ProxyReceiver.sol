pragma solidity ^0.5.0;

import "./IERC1538.sol";
import "./ProxyBaseStorage.sol";

///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @title ProxyReceiver Contract
 * @dev Handles forwarding calls to receiver delegates while offering transparency of updates.
 *      Follows ERC-1538 standard.
 *
 *    NOTE: Not recommended for direct use in a production contract, as no security control.
 *          Provided as simple example only.
 */
///////////////////////////////////////////////////////////////////////////////////////////////////

contract ProxyReceiver is ProxyBaseStorage, IERC1538 {

    /////////////////////////////////////////// VARIABLES /////////////////////////////////////////

    ////////////////////////////////////////// MODIFIERS //////////////////////////////////////////

    /////////////////////////////////////////// EVENTS ////////////////////////////////////////////

    ///////////////////////////////////////// CONSTANTS ///////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor() public {

        proxy = address(this);

        //Adding ERC1538 updateContract function
        bytes memory signature = "updateContract(address,string,string)";
        bytes4 funcId = bytes4(keccak256(signature));
        delegates[funcId] = proxy;
        funcSignatures.push(signature);
        funcSignatureToIndex[signature] = funcSignatures.length;
        emit FunctionUpdate(funcId, address(0), proxy, string(signature));
        emit CommitMessage("Added ERC1538 updateContract function at contract creation");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    function() external payable {
        address delegate = delegates[msg.sig];
        require(delegate != address(0), "Function does not exist.");
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, delegate, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return (ptr, size)}
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    /// @notice Updates functions in a transparent contract.
    /// @dev If the value of _delegate is zero then the functions specified
    ///  in _functionSignatures are removed.
    ///  If the value of _delegate is a delegate contract address then the functions
    ///  specified in _functionSignatures will be delegated to that address.
    /// @param _delegate The address of a delegate contract to delegate to or zero
    /// @param _functionSignatures A list of function signatures listed one after the other
    /// @param _commitMessage A short description of the change and why it is made
    ///        This message is passed to the CommitMessage event.
    function updateContract(address _delegate, string calldata _functionSignatures, string calldata _commitMessage) external {

        // ***
        // NEEDS SECURITY ADDING HERE, SUGGEST MULTI-ADDRESS APPROVAL SYSTEM OR EQUIVALENT.
        // ***

        // pos is first used to check the size of the delegate contract.
        // After that pos is the current memory location of _functionSignatures.
        // It is used to move through the characters of _functionSignatures
        uint256 pos;
        if(_delegate != address(0)) {
            assembly {
                pos := extcodesize(_delegate)
            }
            require(pos > 0, "_delegate address is not a contract and is not address(0)");
        }

        // creates a bytes version of _functionSignatures
        bytes memory signatures = bytes(_functionSignatures);
        // stores the position in memory where _functionSignatures ends.
        uint256 signaturesEnd;
        // stores the starting position of a function signature in _functionSignatures
        uint256 start;
        assembly {
            pos := add(signatures,32)
            start := pos
            signaturesEnd := add(pos,mload(signatures))
        }
        // the function id of the current function signature
        bytes4 funcId;
        // the delegate address that is being replaced or address(0) if removing functions
        address oldDelegate;
        // the length of the current function signature in _functionSignatures
        uint256 num;
        // the current character in _functionSignatures
        uint256 char;
        // the position of the current function signature in the funcSignatures array
        uint256 index;
        // the last position in the funcSignatures array
        uint256 lastIndex;
        // parse the _functionSignatures string and handle each function
        for (; pos < signaturesEnd; pos++) {
            assembly {char := byte(0,mload(pos))}
            // 0x29 == )
            if (char == 0x29) {
                pos++;
                num = (pos - start);
                start = pos;
                assembly {
                    mstore(signatures,num)
                }
                funcId = bytes4(keccak256(signatures));
                oldDelegate = delegates[funcId];
                if(_delegate == address(0)) {
                    index = funcSignatureToIndex[signatures];
                    require(index != 0, "Function does not exist.");
                    index--;
                    lastIndex = funcSignatures.length - 1;
                    if (index != lastIndex) {
                        funcSignatures[index] = funcSignatures[lastIndex];
                        funcSignatureToIndex[funcSignatures[lastIndex]] = index + 1;
                    }
                    funcSignatures.length--;
                    delete funcSignatureToIndex[signatures];
                    delete delegates[funcId];
                    emit FunctionUpdate(funcId, oldDelegate, address(0), string(signatures));
                }
                else if (funcSignatureToIndex[signatures] == 0) {
                    require(oldDelegate == address(0), "FuncId clash.");
                    delegates[funcId] = _delegate;
                    funcSignatures.push(signatures);
                    funcSignatureToIndex[signatures] = funcSignatures.length;
                    emit FunctionUpdate(funcId, address(0), _delegate, string(signatures));
                }
                else if (delegates[funcId] != _delegate) {
                    delegates[funcId] = _delegate;
                    emit FunctionUpdate(funcId, oldDelegate, _delegate, string(signatures));

                }
                assembly {signatures := add(signatures,num)}
            }
        }
        emit CommitMessage(_commitMessage);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

}

///////////////////////////////////////////////////////////////////////////////////////////////////
