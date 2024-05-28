import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SendUserOperationResult } from '@alchemy/aa-core';
import { Contract, ContractReceipt, ContractTransaction } from 'ethers';
import { encodeFunctionData } from 'viem';

import useSwal from './useSwal';

import { RootState } from '../ducks';
import { ContractsInitialType } from '../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../ducks/users/users.types';
import chainData from '../utils/blockchainData';
import { rFetch } from '../utils/rFetch';

const confirmationsRequired = 2;

const useWeb3Tx = () => {
  const { currentChain, currentUserAddress, programmaticProvider } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );
  const { loginType } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const reactSwal = useSwal();
  const dispatch = useDispatch();
  const handleReceipt = useCallback(
    async (transactionHash: string, callback?: (() => void) | undefined) => {
      try {
        await rFetch(`/api/transaction/${currentChain}/${transactionHash}`, {
          method: 'POST'
        });
        callback && callback();
      } catch (error) {
        console.error(error);
      }
    },
    [currentChain]
  );

  const handleWeb3Error = useCallback(
    (errorMessage: any, defaultError: string | undefined = undefined) => {
      // console.info('Reason:', errorMessage.reason);
      // console.info('Code', errorMessage.code);
      // console.info('Error', errorMessage.error);
      // console.info('Method', errorMessage.method);
      // console.info('Transaction', errorMessage.transaction);

      let cleanError = '';

      if (errorMessage.cancelled) {
        cleanError = 'The transaction has been cancelled!';
      } else if (
        errorMessage?.transaction?.blockNumber === null &&
        errorMessage?.receipt?.status === 0
      ) {
        cleanError = 'The transaction has failed on the blockchain';
      } else if (errorMessage.receipt) {
        //console.info('Repriced');
        handleReceipt(errorMessage.receipt);
        return true;
      }

      // Attempt #1: Smart Contract Error
      // Will have a readable revert message for the user
      if (!cleanError) {
        if (
          errorMessage?.error?.message &&
          !errorMessage.error.message.includes('0x')
        ) {
          cleanError = errorMessage?.error?.message;
        }
      }
      if (!cleanError) {
        cleanError = errorMessage?.data?.message;
      }

      // Attempt #2: Frontend Error
      // An error from sending the data to the blockchain
      if (!cleanError) {
        cleanError = errorMessage.reason;
      }

      // Attempt #3: Mid-Processing Error
      // Huge message that needs to be cleaned up
      if (!cleanError) {
        cleanError = errorMessage?.message;
        if (!cleanError) {
          cleanError = errorMessage
            ?.toString()
            ?.split("'message':'execution reverted: ")
            ?.at(1)
            ?.split("'")
            ?.at(0);
        }
      }

      // Last Attempt: Default Error Message
      if (
        !cleanError ||
        cleanError?.includes('=') ||
        cleanError?.includes('0x')
      ) {
        cleanError = defaultError
          ? defaultError
          : 'An unexpected error has ocurred on your transaction, please try again later.';
      }
      console.error(errorMessage);

      reactSwal.fire('Error', cleanError, 'error');
      return false;
    },
    [handleReceipt, reactSwal]
  );

  const metamaskCall = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[],
      options?: {
        failureMessage?: string;
        callback?: () => void;
      }
    ) => {
      let paramsValidation: ContractTransaction;
      if (
        (await contract.provider.getNetwork()).chainId !== Number(currentChain)
      ) {
        return;
      }
      if (!contract[method]) {
        console.error(`Error calling function ${method}, no method found`);
        return false;
      }
      try {
        paramsValidation = await contract[method](...args);
      } catch (errorMessage) {
        return handleWeb3Error(errorMessage, options?.failureMessage);
      }
      if (paramsValidation?.wait) {
        let transactionReceipt: ContractReceipt;
        try {
          transactionReceipt = await paramsValidation.wait(
            confirmationsRequired
          );
        } catch (errorMessage) {
          console.error(`Error calling ${method}`);
          return handleWeb3Error(errorMessage, options?.failureMessage);
        }
        if (transactionReceipt && transactionReceipt.blockNumber) {
          handleReceipt(transactionReceipt.transactionHash, options?.callback);
        }
        return transactionReceipt.transactionHash;
      }
      return paramsValidation;
    },
    [handleReceipt, handleWeb3Error, currentChain]
  );

  const verifyAAUserOperation = useCallback(
    async (
      userOperation: SendUserOperationResult,
      options: {
        failureMessage?: string;
        callback?: () => void;
        intendedBlockchain: BlockchainType;
      }
    ) => {
      if (!programmaticProvider) {
        console.error('Provider not found');
        return;
      }
      try {
        const txHash =
          await programmaticProvider.waitForUserOperationTransaction({
            hash: userOperation.hash
          });
        handleReceipt(txHash, options?.callback);
        return true;
      } catch (err: any) {
        const stringified = err.toString();
        if (
          stringified.includes('Failed to find transaction for User Operation')
        ) {
          reactSwal.fire('Please wait', 'Verifying user operation', 'info');
          return await verifyAAUserOperation(userOperation, options);
        }
        console.info(err);
        reactSwal.fire('Error', err.toString(), 'error');
      }
    },
    [programmaticProvider]
  );

  const web3AuthCall = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[],
      options: {
        failureMessage?: string;
        callback?: () => void;
        intendedBlockchain: BlockchainType;
      }
    ) => {
      if (!currentUserAddress || !programmaticProvider) {
        return;
      }
      const methodFound = Object.keys(contract.interface.functions).find(
        (item) => item.includes(`${method}(`)
      );
      if (
        methodFound &&
        contract.interface.functions[methodFound].stateMutability === 'view'
      ) {
        // If the method is a view function, query the info directly through Ethers
        return await contract[method](...args);
      }
      const fragment = contract.interface.fragments.find((fragment) => {
        return fragment.name === method;
      });
      let transactionValue: bigint = BigInt(0);
      if (args.at(-1).value) {
        transactionValue = BigInt(args.pop().value);
      }
      const uoCallData = encodeFunctionData({
        abi: [fragment],
        functionName: method,
        args: args
      });

      const elegibleForSponsorship = await (
        programmaticProvider.account as any
      ).checkGasSponsorshipEligibility({
        uo: {
          target: contract.address as `0x${string}`,
          data: uoCallData,
          value: transactionValue
        }
      });

      const userOperation = await (programmaticProvider.account as any)
        .sendUserOperation({
          uo: {
            target: contract.address as `0x${string}`,
            data: uoCallData,
            value: transactionValue
          },
          overrides: elegibleForSponsorship
            ? undefined
            : { paymasterAndData: '0x' }
        })
        .catch((err) => {
          // console.info(err);
          reactSwal.fire('Error', err.details, 'error');
        });
      if (!userOperation?.hash) {
        return false;
      }
      return await verifyAAUserOperation(userOperation, options);
    },
    [
      currentUserAddress,
      programmaticProvider,
      handleReceipt,
      reactSwal,
      verifyAAUserOperation
    ]
  );

  const metamaskSwitch = async (chainId: BlockchainType) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId && chainData[chainId]?.chainId }]
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainId && chainData[chainId]?.addChainData]
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  };

  const web3TxSignMessage = useCallback(
    async (message): Promise<any> => {
      if (!currentUserAddress) {
        console.error('Login required to sign messages');
        return '';
      }
      switch (loginType) {
        case 'metamask':
          return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, currentUserAddress]
          });
        case 'web3auth':
          return programmaticProvider?.signMessage(message);
        default:
          reactSwal.fire('Error', 'Please login', 'error');
      }
    },
    [programmaticProvider, currentUserAddress, loginType, reactSwal]
  );

  const web3TxHandler = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[] = [],
      options: {
        failureMessage?: string;
        callback?: () => void;
        intendedBlockchain: BlockchainType;
      } = { intendedBlockchain: currentChain as BlockchainType }
    ) => {
      if (!currentUserAddress) {
        console.error(`Login required for Web3 call ${method}`);
        return;
      }
      switch (loginType) {
        case 'metamask':
          return metamaskCall(contract, method, args, options);
        case 'web3auth':
          return web3AuthCall(contract, method, args, options);
        default:
          reactSwal.fire('Error', 'Please login', 'error');
      }
    },
    [
      currentChain,
      currentUserAddress,
      loginType,
      metamaskCall,
      reactSwal,
      web3AuthCall
    ]
  );

  const web3Switch = useCallback(
    async (chainId: BlockchainType) => {
      if (!currentUserAddress) {
        reactSwal.fire('Please login');
        return;
      }
      switch (loginType) {
        case 'metamask':
          if (chainData[chainId]?.disabled) {
            return;
          }
          return await metamaskSwitch(chainId);
      }
    },
    [currentUserAddress, dispatch, loginType, reactSwal]
  );

  const correctBlockchain = useCallback(
    (chainId: BlockchainType) => {
      return chainId === currentChain;
    },
    [currentChain]
  );

  return {
    correctBlockchain,
    web3Switch,
    web3TxHandler,
    web3TxSignMessage
  };
};

export default useWeb3Tx;
