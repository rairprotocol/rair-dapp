// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { CreditHandlerRoles } from '../AccessControlRoles.sol';
import { CreditHandlerStorage } from '../Storage/CreditHandlerStorage.sol';

/// @title 	Withdraw logic for the credit system
/// @notice Uses the ERC777 interface to transfer tokens back to the users
contract CreditWithdraw is AccessControlEnumerable, CreditHandlerRoles {

    event WithdrewCredit(address user, address token, uint amount);

    function setWithdrawTimeLimit(uint timeInSeconds) public onlyRole(ADMINISTRATOR) {
        CreditHandlerStorage.layout().transferTimeLimit = timeInSeconds;
    }

    function roundedTime() internal view returns (uint time) {
        // Round out by 2 digits
        time = ((block.timestamp + 100) / 100) * 100;
        if ((time - block.timestamp) < CreditHandlerStorage.layout().transferTimeLimit) {
            time += 100;
        }
    }

    function getWithdrawHash(
        address receiver,
        address erc777Address,
        uint amount
    ) public view returns (bytes32) {
        CreditHandlerStorage.Layout storage facetData = CreditHandlerStorage.layout();
        require(
            facetData.userCreditBalance[erc777Address][receiver] >= amount,
            "CreditHandler: Invalid withdraw amount"
        );
        return keccak256(
            abi.encodePacked(
                receiver,
                erc777Address,
                amount,
                facetData.userCreditBalance[erc777Address][receiver],
                roundedTime()
            )
        );
    }

    function getSignedMessageHash(
        bytes32 messageHash
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
    }

    function recoverSigner(
        bytes32 signedMessageHash,
        bytes memory signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(signedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function withdraw(
        address erc777Address,
        uint amount,
        bytes memory signature
    ) public {
        require(
            hasRole(ALLOWED_ERC777, erc777Address),
            "CreditHandler: Invalid token address"
        );
        bytes32 messageHash = getWithdrawHash(msg.sender, erc777Address, amount);
        bytes32 ethSignedMessageHash = getSignedMessageHash(messageHash);
        require(
            hasRole(
                WITHDRAW_SIGNER,
                recoverSigner(ethSignedMessageHash, signature)
            ),
            "CreditHandler: Invalid withdraw request"
        );
        CreditHandlerStorage.Layout storage userData = CreditHandlerStorage.layout();
        require(
            userData.overallUserCreditBalance[msg.sender] >= amount,
            "CreditHandler: Insufficient overall user balance"
        );
        require(
            userData.userCreditBalance[erc777Address][msg.sender] >= amount,
            "CreditHandler: Insufficient user balance"
        );
        userData.overallUserCreditBalance[msg.sender] -= amount;
        userData.userCreditBalance[erc777Address][msg.sender] -= amount;
        IERC777(erc777Address).send(msg.sender, amount, "RAIR Credit Withdraw");
        emit WithdrewCredit(msg.sender, erc777Address, amount);
    }
}