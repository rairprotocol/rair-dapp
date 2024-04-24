// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.25;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccessControlEnumerable } from '../../common/DiamondStorage/AccessControlEnumerable.sol';
import { FactoryHandlerRoles } from '../AccessControlRoles.sol';
import { FactoryStorage } from "../AppStorage.sol";

/// @title 	Withdraw logic for the points system
contract PointsWithdraw is AccessControlEnumerable, FactoryHandlerRoles {

    event WithdrewPoints(address user, address token, uint amount);

    function setWithdrawTimeLimit(uint timeInSeconds) public onlyRole(ADMINISTRATOR) {
        FactoryStorage.layout().transferTimeLimit = timeInSeconds;
    }

    function roundedTime() internal view returns (uint time) {
        // Round out by 2 digits
        time = ((block.timestamp + FactoryStorage.layout().transferTimeLimit) / 100) * 100;
    }

    function getWithdrawHash(
        address receiver,
        address token,
        uint amount
    ) public view returns (bytes32) {
        FactoryStorage.Layout storage facetData = FactoryStorage.layout();
        require(
            facetData.currentUserPoints[receiver] >= amount,
            "PointsWithdraw: Invalid withdraw amount"
        );
        return keccak256(
            abi.encodePacked(
                receiver,
                token,
                amount,
                facetData.currentUserPoints[receiver],
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
        uint amount,
        bytes memory signature
    ) public {
		FactoryStorage.Layout storage store = FactoryStorage.layout();

        bytes32 messageHash = getWithdrawHash(msg.sender, store.currentERC20, amount);
        bytes32 ethSignedMessageHash = getSignedMessageHash(messageHash);
        require(
            hasRole(
                WITHDRAW_SIGNER,
                recoverSigner(ethSignedMessageHash, signature)
            ),
            "PointsWithdraw: Invalid withdraw request"
        );
        require(
            store.currentUserPoints[msg.sender] >= amount,
            "PointsWithdraw: Insufficient points balance"
        );
        store.currentUserPoints[msg.sender] -= amount;
        IERC20(store.currentERC20).transfer(msg.sender, amount);
        emit WithdrewPoints(msg.sender, store.currentERC20, amount);
    }
}