import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import Swal from 'sweetalert2';
import { stringToHex } from 'viem';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { validateInteger } from '../../utils/metamaskUtils';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

const CreditManager = ({ tokenSymbol, updateUserBalance }) => {
  const [tokenAmount, setTokenAmount] = useState(
    BigNumber.from('1000000000000000000')
  );
  const [userCredits, setUserCredits] = useState('-');

  const { web3TxHandler } = useWeb3Tx();
  const reactSwal = useSwal();

  const {
    mainTokenInstance,
    creditHandlerInstance,
    currentUserAddress,
    currentChain
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const {
    primaryColor,
    secondaryColor,
    primaryButtonColor,
    textColor,
    secondaryButtonColor
  } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  const getCredits = useCallback(async () => {
    if (!mainTokenInstance || !currentUserAddress) {
      return;
    }
    const { success, credits } = await rFetch(
      `/api/credits/${currentChain}/${mainTokenInstance.address}`
    );
    if (success) {
      setUserCredits(formatEther(credits));
    }
  }, [currentUserAddress, mainTokenInstance, currentChain]);

  useEffect(() => {
    getCredits();
  }, [getCredits]);

  const sendTokens = useCallback(async () => {
    if (!mainTokenInstance || !creditHandlerInstance) {
      return;
    }
    Swal.fire({
      title: 'Awaiting transaction',
      html: 'Please wait',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(mainTokenInstance, 'send', [
        creditHandlerInstance?.address,
        tokenAmount,
        stringToHex('RAIR Credit Deposit')
      ])
    ) {
      Swal.fire(
        'Success',
        `Deposited ${formatEther(tokenAmount)} ${tokenSymbol} tokens`,
        'success'
      );
      setTimeout(() => {
        getCredits();
        updateUserBalance();
      }, 1500);
    }
  }, [
    creditHandlerInstance,
    tokenAmount,
    mainTokenInstance,
    tokenSymbol,
    getCredits,
    updateUserBalance,
    web3TxHandler
  ]);

  const tryWithdraw = useCallback(async () => {
    if (!currentChain || !mainTokenInstance || !creditHandlerInstance) {
      return;
    }
    const { success, hash } = await rFetch(`/api/credits/withdraw`, {
      method: 'POST',
      body: JSON.stringify({
        blockchain: currentChain,
        tokenAddress: mainTokenInstance.address,
        amount: tokenAmount.toString()
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (success) {
      Swal.fire({
        title: 'Awaiting transaction',
        html: 'Please wait',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(creditHandlerInstance, 'withdraw', [
          mainTokenInstance.address,
          tokenAmount,
          hash
        ])
      ) {
        reactSwal.fire(
          'Success',
          `${formatEther(tokenAmount)} ${tokenSymbol} withdrawn`,
          'success'
        );
        setTimeout(() => {
          getCredits();
          updateUserBalance();
        }, 1500);
      }
    }
  }, [
    currentChain,
    mainTokenInstance,
    creditHandlerInstance,
    tokenAmount,
    tokenSymbol,
    getCredits,
    updateUserBalance,
    web3TxHandler,
    reactSwal
  ]);

  if (!creditHandlerInstance) {
    return <></>;
  }

  return (
    <>
      <hr className="my-3" />
      <div className="col-12 mb-3">
        <h5>Current API Credit:</h5>
        <h2>
          {userCredits} {tokenSymbol}
        </h2>
      </div>
      <InputField
        label="Transfer API credits"
        placeholder="Tokens"
        setter={(value) => {
          if (validateInteger(value)) {
            setTokenAmount(BigNumber.from(value));
          }
        }}
        getter={tokenAmount.toString()}
        type="string"
        customClass="rounded-rair form-control mb-3"
        customCSS={{
          backgroundColor: primaryColor,
          color: 'inherit',
          borderColor: `var(--${secondaryColor}-40)`
        }}
      />
      <div className="col-12">
        <button
          disabled={!mainTokenInstance || !creditHandlerInstance}
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          className="btn rair-button rounded-rair col-6"
          onClick={sendTokens}>
          Purchase {formatEther(tokenAmount)} {tokenSymbol} credits
        </button>
        <button
          disabled={!mainTokenInstance || !creditHandlerInstance}
          className="btn rair-button rounded-rair col-6"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={tryWithdraw}>
          Withdraw {formatEther(tokenAmount)} {tokenSymbol} credits
        </button>
      </div>
      <hr />
    </>
  );
};

export default CreditManager;
