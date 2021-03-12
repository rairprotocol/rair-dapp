pragma solidity ^0.5.0;

/// @title ERC1538 Transparent Contract Standard
/// @dev Required interface
///  Note: the ERC-165 identifier for this interface is 0x61455567
interface IERC1538 {

    /// @dev This emits when one or a set of functions are updated in a transparent contract.
    ///  The message string should give a short description of the change and why
    ///  the change was made.
    event CommitMessage(string message);

    /// @dev This emits for each function that is updated in a transparent contract.
    ///  functionId is the bytes4 of the keccak256 of the function signature.
    ///  oldDelegate is the delegate contract address of the old delegate contract if
    ///  the function is being replaced or removed.
    ///  oldDelegate is the zero value address(0) if a function is being added for the
    ///  first time.
    ///  newDelegate is the delegate contract address of the new delegate contract if
    ///  the function is being added for the first time or if the function is being
    ///  replaced.
    ///  newDelegate is the zero value address(0) if the function is being removed.
    event FunctionUpdate(bytes4 indexed functionId, address indexed oldDelegate, address indexed newDelegate, string functionSignature);

    /// @notice Updates functions in a transparent contract.
    /// @dev If the value of _delegate is zero then the functions specified
    ///  in _functionSignatures are removed.
    ///  If the value of _delegate is a delegate contract address then the functions
    ///  specified in _functionSignatures will be delegated to that address.
    /// @param _delegate The address of a delegate contract to delegate to or zero
    ///        to remove functions.
    /// @param _functionSignatures A list of function signatures listed one after the other
    /// @param _commitMessage A short description of the change and why it is made
    ///        This message is passed to the CommitMessage event.
    function updateContract(address _delegate, string calldata _functionSignatures, string calldata _commitMessage) external;
}
