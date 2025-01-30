/* eslint-disable no-case-declarations */
import { useCallback } from 'react';
import {
  SendUserOperationResult,
  UserOperationOverrides
} from '@alchemy/aa-core';
import { Contract, ContractTransactionResponse } from 'ethers';
import { encodeFunctionData, Hex } from 'viem';

import { useAppDispatch, useAppSelector } from './useReduxHooks';
import useServerSettings from './useServerSettings';
import useSwal from './useSwal';

import { connectChainWeb3Auth, setConnectedChain } from '../redux/web3Slice';
import { CombinedBlockchainData } from '../types/commonTypes';
import { rFetch } from '../utils/rFetch';

const confirmationsRequired = 2;

type web3Options = {
  failureMessage?: string;
  callback?: () => void;
  intendedBlockchain?: Hex;
  sponsored?: Boolean;
};

const useWeb3Tx = () => {
  const dispatch = useAppDispatch();
  const { getBlockchainData } = useServerSettings();

  const { connectedChain, currentUserAddress, programmaticProvider } =
    useAppSelector((store) => store.web3);
  const { loginType } = useAppSelector((store) => store.user);
  const { provider } = useAppSelector((store) => store.web3);
  const reactSwal = useSwal();
  const handleReceipt = useCallback(
    async (transactionHash: string, callback?: (() => void) | undefined) => {
      try {
        await rFetch(`/api/transaction/${connectedChain}/${transactionHash}`, {
          method: 'POST'
        });
        callback && callback();
      } catch (error) {
        console.error(error);
      }
    },
    [connectedChain]
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
        // Repriced
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
      let paramsValidation: ContractTransactionResponse;
      const web3Function = contract.getFunction(method);
      if (!web3Function) {
        console.error(`Error no method called ${method} found`);
        return undefined;
      }
      try {
        paramsValidation = await contract[method](...args);
      } catch (errorMessage) {
        console.error('paramsValidation error', method);
        return handleWeb3Error(errorMessage, options?.failureMessage);
      }
      if (paramsValidation?.wait) {
        try {
          const transactionReceipt = await paramsValidation.wait(
            confirmationsRequired
          );
          if (transactionReceipt && transactionReceipt.blockNumber) {
            handleReceipt(transactionReceipt.hash, options?.callback);
          }
          return transactionReceipt?.hash;
        } catch (errorMessage) {
          console.error(`Error calling ${method}`);
          return handleWeb3Error(errorMessage, options?.failureMessage);
        }
      }
      return paramsValidation;
    },
    [handleReceipt, handleWeb3Error]
  );

  const verifyAAUserOperation = useCallback(
    async (
      contractProvider: any,
      userOperation: SendUserOperationResult,
      options: web3Options
    ) => {
      if (!contractProvider) {
        console.error('Provider not found');
        return;
      }
      try {
        const txHash = await contractProvider.waitForUserOperationTransaction({
          hash: userOperation.hash
        });
        handleReceipt(txHash, options?.callback);
        return true;
      } catch (err: any) {
        const stringified = err.toString();
        if (
          stringified
            .toLowerCase()
            .includes('failed to find transaction for user operation')
        ) {
          reactSwal.fire({
            title: 'Please wait',
            html: 'Verifying user operation',
            icon: 'info',
            showConfirmButton: false
          });
          return await verifyAAUserOperation(
            contractProvider,
            userOperation,
            options
          );
        }
        console.error(err);
        reactSwal.fire('Error', err.toString(), 'error');
      }
    },
    [handleReceipt, reactSwal]
  );

  const web3AuthCall = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[],
      options: web3Options
    ) => {
      if (!currentUserAddress || !contract) {
        return;
      }
      const methodFound = contract.getFunction(method);
      let fragment = methodFound.fragment;
      if (!fragment) {
        fragment = methodFound.getFragment();
      }
      if (fragment.stateMutability === 'view') {
        // If the method is a view function, query the info directly through Ethers
        return await contract[method](...args);
      }
      let transactionValue: bigint = BigInt(0);
      if (args?.at(-1)?.value !== undefined) {
        transactionValue = BigInt(args.pop().value);
      }
      const uoCallData = encodeFunctionData({
        abi: [fragment],
        functionName: method,
        args: args
      });

      const elegibleForSponsorship =
        options.sponsored &&
        !transactionValue &&
        (await (contract.runner as any).account.checkGasSponsorshipEligibility({
          uo: {
            target: await contract.getAddress(),
            data: uoCallData,
            value: transactionValue
          }
        }));

      const overrides: UserOperationOverrides = {
        paymasterAndData: '0x'
      };

      const userOperation = await (contract.runner as any).account
        .sendUserOperation({
          uo: {
            target: await contract.getAddress(),
            data: uoCallData,
            value: transactionValue
          },
          overrides: elegibleForSponsorship ? undefined : overrides
        })
        .catch((err) => {
          console.error(err);
          reactSwal.fire('Error', err.details, 'error');
        });
      if (!userOperation?.hash) {
        return false;
      }
      return await verifyAAUserOperation(
        contract.runner,
        userOperation,
        options
      );
    },
    [currentUserAddress, reactSwal, verifyAAUserOperation]
  );

  const connectWeb3AuthProgrammaticProvider = useCallback(
    async (chainData?: CombinedBlockchainData) => {
      if (!chainData) {
        return;
      }
      dispatch(connectChainWeb3Auth(chainData));
    },
    [dispatch]
  );

  const metamaskSwitch = useCallback(
    async (chainId: Hex) => {
      const ethereum = provider 
      const chainData = getBlockchainData(chainId);
      if (!chainData) {
        return;
      }
      dispatch(setConnectedChain(chainData.hash));
      try {
        await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainData.hash }]
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum?.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainData.hash,
                  chainName: chainData.name,
                  nativeCurrency: {
                    name: chainData.name,
                    symbol: chainData.symbol,
                    decimals: 18
                  },
                  rpcUrls: [chainData.rpcEndpoint],
                  blockExplorerUrls: [chainData.blockExplorerGateway]
                }
              ]
            });
          } catch (addError) {
            dispatch(setConnectedChain(connectedChain));
            console.error(addError);
          }
        } else {
          dispatch(setConnectedChain(connectedChain));
          console.error(switchError);
        }
      }
    },
    [getBlockchainData, connectedChain, dispatch]
  );

  const web3TxSignMessage = useCallback(
    async (message): Promise<any> => {
      const ethereum = provider
      if (!currentUserAddress) {
        console.error('Login required to sign messages');
        return '';
      }
      switch (loginType) {
        case 'metamask':
          return await ethereum?.request({
            method: 'personal_sign',
            params: [message, currentUserAddress]
          });
        case 'web3auth':
          return programmaticProvider?.signMessage(message);
        default:
          reactSwal.fire('Error', 'Please login.', 'error');
      }
    },
    [programmaticProvider, currentUserAddress, loginType, reactSwal]
  );

  const web3TxHandler = useCallback(
    async (
      contract: Contract,
      method: string,
      args: any[] = [],
      options: web3Options = {
        intendedBlockchain: connectedChain
      }
    ) => {
      if (!currentUserAddress) {
        console.error(`Login required for Web3 call ${method}`);
        return undefined;
      }
      switch (loginType) {
        case 'metamask':
          return metamaskCall(contract, method, args, options);
        case 'web3auth':
          return web3AuthCall(contract, method, args, options);
        default:
          reactSwal.fire('Error', 'Please login', 'error');
          return undefined;
      }
    },
    [
      connectedChain,
      currentUserAddress,
      loginType,
      metamaskCall,
      reactSwal,
      web3AuthCall
    ]
  );

  const web3Switch = useCallback(
    async (chainId: Hex | undefined) => {
      if (!chainId) {
        reactSwal.fire('Error', 'Blockchain not supported', 'error');
        return;
      }
      if (!currentUserAddress) {
        reactSwal.fire('Please login');
        return;
      }
      if (getBlockchainData(chainId)?.disabled) {
        return;
      }
      switch (loginType) {
        case 'metamask':
          return await metamaskSwitch(chainId);
        case 'web3auth':
          const chainData = getBlockchainData(chainId);
          if (!chainData) {
            return;
          }
          if (!chainData?.alchemyAppKey) {
            reactSwal.fire(
              'Sorry!',
              `${chainData?.name} is not supported currently`,
              'info'
            );
            return;
          }
          await connectWeb3AuthProgrammaticProvider(
            chainData as CombinedBlockchainData
          );
      }
    },
    [
      currentUserAddress,
      getBlockchainData,
      loginType,
      reactSwal,
      metamaskSwitch,
      connectWeb3AuthProgrammaticProvider
    ]
  );

  const correctBlockchain = useCallback(
    (chainId?: Hex) => {
      return chainId === connectedChain;
    },
    [connectedChain]
  );

  return {
    correctBlockchain,
    web3Switch,
    web3TxHandler,
    web3TxSignMessage
  };
};

export default useWeb3Tx;
