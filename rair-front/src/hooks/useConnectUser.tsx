import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Action } from '@reduxjs/toolkit';
import axios from 'axios';
import { Hex } from 'viem';

import { useAppDispatch, useAppSelector } from './useReduxHooks';
import useServerSettings from './useServerSettings';
import useSwal from './useSwal';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { dataStatuses } from '../redux/commonTypes';
import { loadCurrentUser } from '../redux/userSlice';
import {
  connectChainAlchemyV4,
  connectChainMetamask,
  connectChainWeb3Auth,
  setConnectedChain,
  setExchangeRates,
  setProgrammaticProvider
} from '../redux/web3Slice';
import { CombinedBlockchainData } from '../types/commonTypes';
import { User } from '../types/databaseTypes';
import chainData from '../utils/blockchainData';
import {
  rFetch,
  signWeb3MessageAlchemyV4,
  signWeb3MessageMetamask,
  signWeb3MessageWeb3Auth
} from '../utils/rFetch';
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

  const { textColor, primaryButtonColor, primaryColor } = useAppSelector(
    (store) => store.colors
  );

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const reactSwal = useSwal();
  const navigate = useNavigate();
  const location = useLocation();

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

  const loginWithAlchemySigner = useCallback(async () => {
    const defaultChain: Hex = import.meta.env.VITE_DEFAULT_BLOCKCHAIN;
    const chainInformation = getBlockchainData(defaultChain);
    if (
      !chainInformation?.hash ||
      !chainInformation?.alchemy ||
      !chainInformation?.viem ||
      !chainInformation?.alchemyAppKey
    ) {
      return {};
    }

    const { connectedChain, currentUserAddress, userDetails } = await dispatch(
      connectChainAlchemyV4(chainInformation as CombinedBlockchainData)
    ).unwrap();

    return {
      userAddress: currentUserAddress,
      blockchain: connectedChain,
      userDetails
    };
  }, [dispatch, getBlockchainData]);

  const loginWithWeb3Auth = useCallback(async () => {
    const defaultChain: Hex = import.meta.env.VITE_DEFAULT_BLOCKCHAIN;
    const chainInformation = getBlockchainData(defaultChain);
    if (
      !chainInformation?.hash ||
      !chainInformation?.alchemy ||
      !chainInformation?.viem ||
      !chainInformation?.alchemyAppKey
    ) {
      return {};
    }

    reactSwal.fire({
      title: 'Connecting',
      html: 'Please wait',
      icon: 'info',
      showConfirmButton: false
    });

    const { connectedChain, currentUserAddress, userDetails } = await dispatch(
      connectChainWeb3Auth(chainInformation as CombinedBlockchainData)
    ).unwrap();

    return {
      userAddress: currentUserAddress,
      blockchain: connectedChain,
      userDetails
    };
  }, [getBlockchainData, reactSwal, dispatch]);

  const loginWithMetamask = useCallback(async () => {
    const { connectedChain, currentUserAddress } = await dispatch(
      connectChainMetamask()
    ).unwrap();
    if (!currentUserAddress) {
      return {};
    }
    return {
      userAddress: currentUserAddress,
      blockchain: connectedChain
    };
  }, [dispatch]);

  const loginWithProgrammaticProvider = useCallback(async () => {
    if (!programmaticProvider) {
      return {};
    }
    return {
      userAddress: (await programmaticProvider.getAddress()) as Hex,
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
              <hr />
              <button
                className="btn btn-light"
                onClick={() => resolve('alchemyV4')}>
                Google
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

  const connectUserData = useCallback(
    async (loginMethod?: string) => {
      let loginData: {
        userAddress?: Hex;
        blockchain?: Hex;
        userDetails?: any;
      };
      const dispatchStack: Array<Action> = [];
      if (!loginMethod) {
        loginMethod = await selectMethod();
      }
      reactSwal.close();
      try {
        switch (loginMethod) {
          case 'alchemyV4':
            loginData = await loginWithAlchemySigner();
            break;
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
      if (!loginData?.userAddress) {
        reactSwal.fire('Error', 'No user address found', 'error');
        return;
      }

      dispatchStack.push(setExchangeRates(await getCoingeckoRates()));
      dispatchStack.push(setConnectedChain(loginData.blockchain));

      let willUpdateUserData = false;

      try {
        // Check if user exists in DB
        const userDataResponse = await axios.get<TUserResponse>(
          `/api/users/${loginData.userAddress}`
        );
        let user = userDataResponse.data.user;
        if (!userDataResponse.data.success || !user) {
          // If the user doesn't exist, send a request to register him using a TEMP adminNFT
          willUpdateUserData = true;
          const relevantUserData = { publicAddress: loginData.userAddress };
          if (loginData?.userDetails?.email) {
            relevantUserData['email'] = loginData.userDetails.email;
          }
          const userCreation = await axios.post<TUserResponse>(
            '/api/users',
            JSON.stringify(relevantUserData),
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          user = userCreation.data.user;
        } else if (
          !userDataResponse?.data?.user?.email &&
          loginData?.userDetails?.email
        ) {
          willUpdateUserData = true;
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
              console.error('Programmatic support not available');
              break;
            case 'metamask':
              loginResponse = await signWeb3MessageMetamask(
                loginData.userAddress
              );
              break;
            case 'alchemyV4':
              loginResponse = await signWeb3MessageAlchemyV4(
                loginData.userAddress,
                loginData.userDetails
              );
              break;
            case 'web3auth':
              loginResponse = await signWeb3MessageWeb3Auth(
                loginData.userAddress
              );
              reactSwal.close();
              if (willUpdateUserData) {
                const userData = await loginData.userDetails;
                const availableData: Partial<User> = {};
                if (userData?.email && !loginResponse.user.email) {
                  availableData.email = userData.email;
                }
                if (userData?.email && !loginResponse.user.nickName) {
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
    },
    [
      selectMethod,
      reactSwal,
      loginWithAlchemySigner,
      loginWithWeb3Auth,
      loginWithMetamask,
      loginWithProgrammaticProvider,
      adminRights,
      currentUserAddress,
      dispatch
    ]
  );

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
      if (
        location.pathname.includes('creator') ||
        location.pathname.includes('demo') ||
        location.pathname.includes('settings') ||
        location.pathname.includes('admin') ||
        location.pathname.includes('on-sale') ||
        location.pathname.includes('user/videos') ||
        location.pathname.includes('license')
      ) {
        navigate('/', { replace: true });
      }
    }
  }, [dispatch, navigate, currentUserAddress, location]);

  const checkLoginOnStart = useCallback(async () => {
    if (isLoggedIn || loginStatus !== dataStatuses.Uninitialized) {
      return;
    }
    const userData = await dispatch(loadCurrentUser()).unwrap();
    switch (userData?.loginType) {
      case 'metamask':
        if (window.ethereum.selectedAddress !== userData.publicAddress) {
          return await logoutUser();
        }
        dispatch(setExchangeRates(await getCoingeckoRates()));
        dispatch(connectChainMetamask());
        break;
      default:
        logoutUser();
        break;
    }
  }, [dispatch, isLoggedIn, loginStatus, logoutUser]);

  useEffect(() => {
    checkLoginOnStart();
  }, []);

  return {
    connectUserData,
    logoutUser
  };
};

export default useConnectUser;
