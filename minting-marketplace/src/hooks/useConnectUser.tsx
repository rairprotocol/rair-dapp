//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  getDefaultLightAccountFactoryAddress,
  LightSmartContractAccount
} from '@alchemy/aa-accounts';
import { AccountSigner, EthersProviderAdapter } from '@alchemy/aa-ethers';
import { Web3AuthSigner } from '@alchemy/aa-signers/web3auth';
import { Alchemy } from 'alchemy-sdk';
import axios from 'axios';
import { AuthProvider } from 'oreid-js';
import { useOreId } from 'oreid-react';

import useSwal from './useSwal';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { RootState } from '../ducks';
import { getTokenComplete, getTokenStart } from '../ducks/auth/actions';
import {
  setChainId,
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

const oreIdMappingToChainHash = {
  eth_main: '0x1' as BlockchainType,
  eth_goerli: '0x5' as BlockchainType,
  polygon_main: '0x89' as BlockchainType,
  polygon_mumbai: '0x13881' as BlockchainType
};

const useConnectUser = () => {
  const dispatch = useDispatch();
  const { adminRights, loginProcess, loggedIn, loginType } = useSelector<
    RootState,
    TUsersInitialState
  >((store) => store.userStore);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  const { currentUserAddress, programmaticProvider, currentChain } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );

  const hotdropsVar = import.meta.env.VITE_HOTDROPS;

  const reactSwal = useSwal();
  const navigate = useNavigate();
  const oreId = useOreId();

  const checkMetamask = useCallback(() => {
    setMetamaskInstalled(window?.ethereum && window?.ethereum?.isMetaMask);
  }, [setMetamaskInstalled]);

  const findMethodForOreId = useCallback(
    (account) => {
      if (!currentChain && account.chainAccount.length === 42) {
        // If there is no default blockchain then take the first valid address
        // (42 characters)
        return true;
      }
      return account.chainNetwork === chainData[currentChain]?.oreIdAlias;
    },
    [currentChain]
  );

  const loginWithOreIdToken = useCallback(
    async (idToken: string) => {
      if (!idToken) {
        return;
      }
      await oreId.auth.loginWithToken({ idToken });
      const userAccount =
        oreId.auth.user.data.chainAccounts.find(findMethodForOreId);
      return {
        address: userAccount.chainAccount,
        blockchain: oreIdMappingToChainHash[userAccount.chainNetwork]
      };
    },
    [oreId, findMethodForOreId]
  );

  const loginWithOreId = useCallback(
    async (loginMethod: AuthProvider) => {
      const response = await oreId.popup.auth({ provider: loginMethod });
      const userAccount = response.user.chainAccounts.find(findMethodForOreId);
      if (!userAccount) {
        return { address: undefined, blockchain: undefined };
      }
      return {
        address: userAccount.chainAccount,
        blockchain: oreIdMappingToChainHash[userAccount.chainNetwork],
        idToken: response.idToken,
        provider: loginMethod
      };
    },
    [oreId, findMethodForOreId]
  );
  const loginWithWeb3Auth = useCallback(async () => {
    const chainInformation = chainData[currentChain];
    const alchemy = new Alchemy({
      apiKey: import.meta.env.VITE_ALCHEMY_KEY,
      network: chainInformation.alchemy,
      maxRetries: 10
    });
    const ethersProvider = await alchemy.config.getProvider();

    const alchemyProvider =
      EthersProviderAdapter.fromEthersProvider(ethersProvider);

    // 1. Create a provider using EthersProviderAdapter
    const web3AuthSigner = new Web3AuthSigner({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: chainInformation.chainId,
        rpcTarget: chainInformation.addChainData.rpcUrls[0],
        displayName: chainInformation.name,
        blockExplorer: chainInformation.addChainData.blockExplorerUrls[0],
        ticker: chainInformation.symbol,
        tickerName: chainInformation.name
      },
      web3AuthNetwork: 'sapphire_devnet'
    });

    await web3AuthSigner.authenticate({
      init: async () => {
        await web3AuthSigner.inner.initModal();
      },
      connect: async () => {
        await web3AuthSigner.inner.connect();
      }
    });

    const provider = alchemyProvider.connectToAccount(
      (rpcClient) =>
        new LightSmartContractAccount({
          chain: chainInformation.viem,
          owner: web3AuthSigner,
          factoryAddress: getDefaultLightAccountFactoryAddress(
            chainInformation.viem
          ),
          rpcClient
        })
    );

    dispatch(setProgrammaticProvider(provider));
    provider.signTypedData = web3AuthSigner.signTypedData;
    provider.userDetails = web3AuthSigner.getAuthDetails;

    return {
      userAddress: await provider.getAddress(),
      ownerAddress: await provider.account.owner.getAddress(),
      blockchain: currentChain,
      alchemyProvider: provider
    };
  }, [currentChain, dispatch]);

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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
                  style={{
                    color: '#fff'
                  }}
                  className={`btn ${
                    hotdropsVar === 'true' ? 'hotdrops-bg' : 'btn-stimorol'
                  }`}
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
    [hotdropsVar, metamaskInstalled, reactSwal]
  );

  const connectUserData = useCallback(async () => {
    dispatch(setLoginProcessStatus(true));
    let loginData: {
      userAddress: string | undefined;
      ownerAddress: string | undefined;
      blockchain: BlockchainType | undefined;
      idToken?: string;
      provider?: string;
      alchemyProvider?: AccountSigner<LightSmartContractAccount>;
    };
    const dispatchStack = [];
    const loginMethod: string = await selectMethod();
    const [loginConnection, oreIdProvider] = loginMethod.split('-');
    reactSwal.close();
    try {
      switch (loginConnection) {
        case 'web3auth':
          loginData = await loginWithWeb3Auth();
          break;
        case 'metamask':
          loginData = await loginWithMetamask();
          break;
        case 'programmatic':
          loginData = await loginWithProgrammaticProvider();
          break;
        case 'oreid':
          loginData = await loginWithOreId(oreIdProvider as AuthProvider);
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

    dispatchStack.push(
      setChainId(
        loginData.blockchain,
        loginConnection === 'oreid' ? loginData.userAddress : undefined
      )
    );

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
        switch (loginConnection) {
          case 'oreid':
            loginResponse = await rFetch('/api/v2/auth/oreId', {
              method: 'POST',
              body: JSON.stringify({
                idToken: loginData.idToken,
                blockchain: loginData.blockchain
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (firstTimeLogin) {
              oreId.auth.user.getData();
              const oreIdUserData = oreId.auth.user.data;
              const userName = oreIdUserData.name.split(' ');
              const newUserResponse = await axios.patch(
                `/api/v2/users/${loginData.userAddress.toLowerCase()}`,
                {
                  email: oreIdUserData.email,
                  nickName: oreIdUserData.username,
                  firstName: userName.slice(0, userName.length / 2).join(' '),
                  lastName: userName.slice(userName.length / 2).join(' ')
                }
              );
              user = newUserResponse.data.user;
            }
            break;
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
                `/api/v2/users/${loginData.userAddress.toLowerCase()}`,
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
          dispatchStack.push(setLoginType(loginConnection));
          dispatchStack.forEach((dispatchItem) => {
            dispatch(dispatchItem);
          });
          dispatch(setLogInStatus(true));
        }
      }
      dispatch(setLoginProcessStatus(false));
    } catch (err) {
      console.error('Error on login', err);
      dispatch(setLoginProcessStatus(false));
    }
  }, [
    oreId,
    selectMethod,
    loginWithMetamask,
    loginWithProgrammaticProvider,
    loginWithOreId,
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
        '/api/v2/auth/me/',
        undefined,
        undefined,
        false
      );
      if (success && user) {
        if (user.oreId) {
          const { address, blockchain } = await loginWithOreIdToken(user.oreId);
          dispatch(setChainId(blockchain, address));
          dispatch(setLoginType('oreid'));
        } else {
          if (!window?.ethereum?.selectedAddress) {
            // Metamask isn't connected anymore to the page,
            //  it's unreliable to use the login data in this case
            dispatch(setLoginProcessStatus(false));
            return await logoutUser();
          }
          dispatch(setChainId(window.ethereum.chainId?.toLowerCase()));
          dispatch(setLoginType('metamask'));
        }
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
    const { success } = await rFetch('/api/v2/auth/logout');
    if (loginType === 'oreid') {
      oreId.auth.logout();
      oreId.logout();
    }
    if (success) {
      dispatch(getTokenComplete(null));
      dispatch(setUserAddress(undefined));
      dispatch(setAdminRights(false));
      dispatch(setLoginType(undefined));
      dispatch(setLogInStatus(false));
      dispatch(setUserData(undefined));
      navigate('/');
    }
  }, [dispatch, navigate, oreId, loginType]);

  return {
    connectUserData,
    logoutUser
  };
};

export default useConnectUser;
