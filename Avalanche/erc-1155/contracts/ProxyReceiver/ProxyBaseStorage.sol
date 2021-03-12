pragma solidity ^0.5.0;

///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @title ProxyBaseStorage
 * @dev Defining base storage for the proxy contract.
 */
///////////////////////////////////////////////////////////////////////////////////////////////////

contract ProxyBaseStorage {

    //////////////////////////////////////////// VARS /////////////////////////////////////////////

    // maps functions to the delegate contracts that execute the functions.
    // funcId => delegate contract
    mapping(bytes4 => address) public delegates;

    // array of function signatures supported by the contract.
    bytes[] internal funcSignatures;

    // maps each function signature to its position in the funcSignatures array.
    // signature => index+1
    mapping(bytes => uint256) internal funcSignatureToIndex;

    // proxy address of itself, can be used for cross-delegate calls but also safety checking.
    address proxy;

    ///////////////////////////////////////////////////////////////////////////////////////////////

}