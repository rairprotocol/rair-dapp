//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { MultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AccountSigner } from '@alchemy/aa-ethers';
import axios from 'axios';

import useSwal from './useSwal';
import useWeb3Tx from './useWeb3Tx';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { RootState } from '../ducks';
import { getTokenComplete, getTokenStart } from '../ducks/auth/actions';
import { ColorStoreType } from '../ducks/colors/colorStore.types';
import {
  setChainId,
  setCoingeckoRates,
  setProgrammaticProvider,
  setUserAddress
} from '../ducks/contracts/actions';
import { ContractsInitialType } from '../ducks/contracts/contracts.types';
import {
  getUserComplete,
  setAdminRights,
  setLoginProcessStatus,
  setLogInStatus,
  setLoginType,
  setSuperAdmin,
  setUserData
} from '../ducks/users/actions';
import { TUsersInitialState } from '../ducks/users/users.types';
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
  const dispatch = useDispatch();
  const { adminRights, loginProcess, loggedIn } = useSelector<
    RootState,
    TUsersInitialState
  >((store) => store.userStore);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  const { currentUserAddress, programmaticProvider, currentChain } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );
  const { connectWeb3AuthProgrammaticProvider } = useWeb3Tx();

  const { textColor, primaryButtonColor, primaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

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
    if (!currentChain) {
      return;
    }
    const chainInformation = chainData[currentChain];
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
      userAddress: provider.account.account.address,
      ownerAddress: provider.account.account.publicKey,
      blockchain: currentChain,
      alchemyProvider: provider
    };
  }, [currentChain, connectWeb3AuthProgrammaticProvider]);

  const loginWithMetamask = useCallback(async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    if (!accounts) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      userAddress: accounts[0],
      signerAddress: accounts[0],
      blockchain: window.ethereum.chainId?.toLowerCase() as BlockchainType
    };
  }, []);

  const loginWithProgrammaticProvider = useCallback(async () => {
    if (!programmaticProvider) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      userAddress: programmaticProvider.address,
      signerAddress: programmaticProvider.address,
      blockchain: currentChain
    };
  }, [currentChain, programmaticProvider]);

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
    dispatch(setLoginProcessStatus(true));
    let loginData:
      | {
          userAddress: string | undefined;
          ownerAddress: string | undefined;
          blockchain: BlockchainType | undefined;
          idToken?: string;
          provider?: string;
          alchemyProvider?: AccountSigner<MultiOwnerModularAccount>;
        }
      | undefined;
    const dispatchStack = [];
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
          dispatch(setLoginProcessStatus(false));
          return;
      }
    } catch (err) {
      console.error('Login error', err);
      dispatch(setLoginProcessStatus(false));
      return;
    }
    if (!loginData?.userAddress || loginData?.userAddress === '') {
      reactSwal.fire('Error', 'No user address found', 'error');
      dispatch(setLoginProcessStatus(false));
      return;
    }

    dispatchStack.push(setCoingeckoRates(await getCoingeckoRates()));

    dispatchStack.push(setChainId(loginData.blockchain));

    let firstTimeLogin = false;

    try {
      // Check if user exists in DB
      const userDataResponse = await axios.get<TUserResponse>(
        `/api/users/${loginData.userAddress}`
      );
      let user = userDataResponse.data.user;
      if (!userDataResponse.data.success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        // console.info('Address is not registered!');
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
        user = userCreation.data;
      }

      // Authorize user
      if (
        adminRights === null ||
        adminRights === undefined ||
        !currentUserAddress
      ) {
        dispatchStack.push(getTokenStart());
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
              const availableData = {};
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
        if (!userDataResponse.data.success) {
          dispatch(setAdminRights(false));
          dispatch(setUserData(undefined));
        } else if (loginResponse.success) {
          dispatch(setUserData(user));
          dispatchStack.push(setUserAddress(loginResponse.user.publicAddress));
          dispatchStack.push(getUserComplete(loginResponse.user));
          dispatchStack.push(setAdminRights(loginResponse.user.adminRights));
          dispatchStack.push(setSuperAdmin(loginResponse.user.superAdmin));
          dispatchStack.push(setLoginType(loginMethod));
          dispatchStack.forEach((dispatchItem) => {
            dispatch(dispatchItem);
          });
          dispatch(setLogInStatus(true));
          sockets.nodeSocket.connect();
        }
      }
      dispatch(setLoginProcessStatus(false));
    } catch (err) {
      console.error('Error on login', err);
      dispatch(setLoginProcessStatus(false));
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

  useEffect(() => {
    if (loggedIn || loginProcess) {
      return;
    }
    (async () => {
      dispatch(setLoginProcessStatus(true));
      const { success, user } = await rFetch(
        '/api/auth/me/',
        undefined,
        undefined,
        false
      );
      if (success && user) {
        if (!window?.ethereum?.selectedAddress) {
          // Metamask isn't connected anymore to the page,
          //  it's unreliable to use the login data in this case
          dispatch(setLoginProcessStatus(false));
          return await logoutUser();
        }
        dispatch(setChainId(window.ethereum.chainId?.toLowerCase()));
        dispatch(setLoginType('metamask')); // Because web3 logins end on page reload
        dispatch(setCoingeckoRates(await getCoingeckoRates()));
        dispatch(setUserData(user));
        dispatch(setUserAddress(user.publicAddress));
        dispatch(getUserComplete(user));
        dispatch(setAdminRights(user.adminRights));
        dispatch(setSuperAdmin(user.superAdmin));
        dispatch(setLogInStatus(true));
      }
      dispatch(setLoginProcessStatus(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutUser = useCallback(async () => {
    const { success } = await rFetch('/api/auth/logout');
    if (success) {
      sockets.nodeSocket.emit('logout', currentUserAddress.toLowerCase());
      sockets.nodeSocket.disconnect();
      dispatch(getTokenComplete(null));
      dispatch(setUserAddress(undefined));
      dispatch(setAdminRights(false));
      dispatch(setLoginType(undefined));
      dispatch(setLogInStatus(false));
      dispatch(setUserData(undefined));
      dispatch(setProgrammaticProvider(undefined));
      dispatch(setChainId(import.meta.env.VITE_DEFAULT_BLOCKCHAIN));
      navigate('/');
    }
  }, [dispatch, navigate, currentUserAddress]);

  return {
    connectUserData,
    logoutUser
  };
};

export default useConnectUser;
