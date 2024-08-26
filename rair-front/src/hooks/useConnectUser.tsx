import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Action } from '@reduxjs/toolkit';
import axios from 'axios';

import { useAppDispatch, useAppSelector } from './useReduxHooks';
import useServerSettings from './useServerSettings';
import useSwal from './useSwal';
import useWeb3Tx from './useWeb3Tx';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { dataStatuses } from '../redux/commonTypes';
import { loadCurrentUser } from '../redux/userSlice';
import {
  connectChainMetamask,
  setConnectedChain,
  setExchangeRates,
  setProgrammaticProvider
} from '../redux/web3Slice';
import { User } from '../types/databaseTypes';
import chainData from '../utils/blockchainData';
import { rFetch, signWeb3Message } from '../utils/rFetch';
import sockets from '../utils/sockets';

const getCoingeckoRates = async () => {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${Object.keys(
        chainData
      )
        .filter((chain) => chainData[chain].coingecko)
        .map((chain) => chainData[chain].coingecko)
        .join(',')}&vs_currencies=usd`
    );
    if (data) {
      const rateData = {};
      Object.keys(chainData).forEach((chain) => {
        if (chainData[chain].coingecko) {
          rateData[chain] = data[chainData[chain].coingecko].usd;
        } else {
          rateData[chain] = 0;
        }
      });
      return rateData;
    }
  } catch (err) {
    console.error('Error querying CoinGecko rates', err);
  }
};

const useConnectUser = () => {
  const dispatch = useAppDispatch();
  const { getBlockchainData } = useServerSettings();
  const { adminRights, loginStatus, isLoggedIn } = useAppSelector(
    (store) => store.user
  );
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  const { currentUserAddress, programmaticProvider, connectedChain } =
    useAppSelector((store) => store.web3);
  const { connectWeb3AuthProgrammaticProvider } = useWeb3Tx();

  const { textColor, primaryButtonColor, primaryColor } = useAppSelector(
    (store) => store.colors
  );

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const reactSwal = useSwal();
  const navigate = useNavigate();

  const checkMetamask = useCallback(() => {
    setMetamaskInstalled(window?.ethereum && window?.ethereum?.isMetaMask);
  }, [setMetamaskInstalled]);

  useEffect(() => {
    if (currentUserAddress) {
      sockets.nodeSocket.on('connect', () => {
        sockets.nodeSocket.emit('login', currentUserAddress.toLowerCase());
      });
    }
    return () => {
      sockets.nodeSocket.off('connect');
    };
  }, [currentUserAddress]);

  const loginWithWeb3Auth = useCallback(async () => {
    if (!connectedChain) {
      return;
    }
    const chainInformation = getBlockchainData(connectedChain);
    if (
      !chainInformation?.alchemy ||
      !chainInformation?.viem ||
      !chainInformation?.alchemyAppKey
    ) {
      return;
    }

    const provider =
      await connectWeb3AuthProgrammaticProvider(chainInformation);

    return {
      userAddress: provider?.account.address,
      ownerAddress: provider?.account.publicKey,
      blockchain: connectedChain,
      alchemyProvider: provider
    };
  }, [connectedChain, connectWeb3AuthProgrammaticProvider, getBlockchainData]);

  const loginWithMetamask = useCallback(async () => {
    const { connectedChain, currentUserAddress } = await dispatch(
      connectChainMetamask()
    ).unwrap();
    if (!currentUserAddress) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      userAddress: currentUserAddress,
      signerAddress: currentUserAddress,
      blockchain: connectedChain
    };
  }, [dispatch]);

  const loginWithProgrammaticProvider = useCallback(async () => {
    if (!programmaticProvider) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      userAddress: await programmaticProvider.getAddress(),
      signerAddress: await programmaticProvider.getAddress(),
      blockchain: connectedChain
    };
  }, [connectedChain, programmaticProvider]);

  const selectMethod = useCallback(
    () =>
      new Promise((resolve: (value: string) => void) => {
        reactSwal.fire({
          title: `Welcome to ${hotdropsVar === 'true' ? 'HOTDROPS' : 'RAIR'}`,
          html: (
            <>
              Please select a login method
              <hr />
              {!metamaskInstalled ? (
                <OnboardingButton />
              ) : (
                <button
                  className="btn rair-button"
                  style={{
                    background: `${
                      primaryColor === '#dedede'
                        ? import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : 'linear-gradient(to right, #e882d5, #725bdb)'
                        : import.meta.env.VITE_TESTNET === 'true'
                          ? primaryButtonColor ===
                            'linear-gradient(to right, #e882d5, #725bdb)'
                            ? 'var(--hot-drops)'
                            : primaryButtonColor
                          : primaryButtonColor
                    }`,
                    color: textColor
                  }}
                  onClick={() => resolve('metamask')}>
                  Web3
                </button>
              )}
              <hr />
              <button
                className="btn btn-light"
                onClick={() => resolve('web3auth')}>
                Social Logins
              </button>
              <div className="login-modal-down-text">
                <div>Each social login creates a unique wallet address</div>
                <div>
                  If you login with a different account, you won’t see purchases
                  in your other wallets
                </div>
              </div>
            </>
          ),
          showConfirmButton: false
        });
        // .then((result) => {
        //   if (result.isDismissed) {
        //     dispatch(setLoginProcessStatus(false));
        //   }
        // });
      }),
    [
      hotdropsVar,
      metamaskInstalled,
      reactSwal,
      primaryButtonColor,
      textColor,
      primaryColor
    ]
  );

  const connectUserData = useCallback(async () => {
    let loginData: any;
    const dispatchStack: Array<Action> = [];
    const loginMethod: string = await selectMethod();
    reactSwal.close();
    try {
      switch (loginMethod) {
        case 'web3auth':
          loginData = await loginWithWeb3Auth();
          break;
        case 'metamask':
          loginData = await loginWithMetamask();
          break;
        case 'programmatic':
          loginData = await loginWithProgrammaticProvider();
          break;
        default:
          reactSwal.fire({
            title: 'Please install a Crypto wallet',
            html: (
              <div>
                <OnboardingButton />
              </div>
            ),
            icon: 'error'
          });
          return;
      }
    } catch (err) {
      console.error('Login error', err);
      return;
    }
    if (!loginData?.userAddress || loginData?.userAddress === '') {
      reactSwal.fire('Error', 'No user address found', 'error');
      return;
    }

    dispatchStack.push(setExchangeRates(await getCoingeckoRates()));

    dispatchStack.push(setConnectedChain(loginData.blockchain));

    let firstTimeLogin = false;

    try {
      // Check if user exists in DB
      const userDataResponse = await axios.get<TUserResponse>(
        `/api/users/${loginData.userAddress}`
      );
      let user = userDataResponse.data.user;
      if (!userDataResponse.data.success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        firstTimeLogin = true;
        const userCreation = await axios.post<TUserResponse>(
          '/api/users',
          JSON.stringify({ publicAddress: loginData.userAddress }),
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        user = userCreation.data.user;
      }

      // Authorize user
      if (
        adminRights === null ||
        adminRights === undefined ||
        !currentUserAddress
      ) {
        let loginResponse;
        switch (loginMethod) {
          case 'programmatic':
            loginResponse = await signWeb3Message(
              loginData.userAddress,
              'programmatic',
              programmaticProvider?._signTypedData
            );
            break;
          case 'metamask':
            loginResponse = await signWeb3Message(loginData.userAddress);
            break;
          case 'web3auth':
            loginResponse = await signWeb3Message(
              loginData.userAddress,
              'web3auth',
              loginData.alchemyProvider.signTypedData,
              loginData.ownerAddress
            );
            if (firstTimeLogin) {
              const userData = await loginData.alchemyProvider.userDetails();
              const availableData: Partial<User> = {};
              if (userData.email) {
                availableData.email = userData.email;
                availableData.nickName = userData.email?.split('@')?.[0];
              }
              if (userData.name && !userData.name.includes('@')) {
                availableData.firstName = userData.name.split(' ')?.[0];
                availableData.lastName = userData.name.split(' ')?.[0];
              }
              const newUserResponse = await axios.patch(
                `/api/users/${loginData.userAddress.toLowerCase()}`,
                availableData
              );
              user = newUserResponse.data.user;
            }
            //  provider.accountProvider.signTypedData
            break;
        }
        dispatch(loadCurrentUser());
        if (loginResponse.success) {
          dispatchStack.forEach((dispatchItem) => {
            dispatch(dispatchItem);
          });
          sockets.nodeSocket.connect();
        }
      }
    } catch (err) {
      console.error('Error on login', err);
    }
  }, [
    selectMethod,
    loginWithMetamask,
    loginWithProgrammaticProvider,
    loginWithWeb3Auth,
    reactSwal,
    adminRights,
    currentUserAddress,
    programmaticProvider,
    dispatch
  ]);

  useEffect(() => {
    checkMetamask();
  }, [checkMetamask]);

  const logoutUser = useCallback(async () => {
    const { success } = await rFetch('/api/auth/logout');
    if (success) {
      dispatch(loadCurrentUser());
      sockets.nodeSocket.emit('logout', currentUserAddress?.toLowerCase());
      sockets.nodeSocket.disconnect();
      dispatch(setProgrammaticProvider(undefined));
      dispatch(setConnectedChain(import.meta.env.VITE_DEFAULT_BLOCKCHAIN));
      navigate('/');
    }
  }, [dispatch, navigate, currentUserAddress]);

  useEffect(() => {
    if (isLoggedIn || loginStatus === dataStatuses.Loading) {
      return;
    }
    (async () => {
      const userData = await dispatch(loadCurrentUser()).unwrap();
      switch (userData?.loginType) {
        case 'metamask':
          dispatch(connectChainMetamask());
          dispatch(setExchangeRates(await getCoingeckoRates()));
          break;
        default:
          logoutUser();
          break;
      }
    })();
  }, []);

  return {
    connectUserData,
    logoutUser
  };
};

export default useConnectUser;
