//@ts-nocheck
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { AuthProvider } from 'oreid-js';
import LoginProviderButton from 'oreid-login-button';
import { useOreId } from 'oreid-react';

import useSwal from './useSwal';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { RootState } from '../ducks';
import { getTokenComplete, getTokenStart } from '../ducks/auth/actions';
import { setChainId, setUserAddress } from '../ducks/contracts/actions';
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

  const { currentUserAddress, programmaticProvider, currentChain } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );

  const reactSwal = useSwal();
  const navigate = useNavigate();
  const oreId = useOreId();

  const loginWithOreIdToken = useCallback(
    async (idToken: string) => {
      if (!idToken) {
        return;
      }
      await oreId.auth.loginWithToken({ idToken });
      const userAccount = oreId.auth.user.data.chainAccounts.find((account) =>
        account.chainNetwork.includes('eth')
      );
      await oreId.init();
      return {
        address: userAccount.chainAccount,
        blockchain: oreIdMappingToChainHash[userAccount.chainNetwork]
      };
    },
    [oreId]
  );

  const loginWithOreId = useCallback(
    async (loginMethod: AuthProvider) => {
      const response = await oreId.popup.auth({ provider: loginMethod });
      const userAccount = response.user.chainAccounts.find((account) =>
        account.chainNetwork.includes('eth')
      );
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
    [oreId]
  );

  const loginWithMetamask = useCallback(async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    if (!accounts) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      address: accounts[0],
      blockchain: window.ethereum.chainId?.toLowerCase() as BlockchainType
    };
  }, []);

  const loginWithProgrammaticProvider = useCallback(async () => {
    if (!programmaticProvider) {
      return { address: undefined, blockchain: undefined };
    }
    return {
      address: programmaticProvider.address,
      blockchain: currentChain
    };
  }, [currentChain, programmaticProvider]);

  const selectMethod = useCallback(
    () =>
      new Promise((resolve: (value: string) => void) => {
        reactSwal.fire({
          title: 'Welcome to RAIR',
          html: (
            <>
              Please select a login method
              <hr />
              <button
                className="btn btn-stimorol"
                onClick={() => resolve('metamask')}>
                Login Web3
              </button>
              <hr />
              {[
                'google'
                //'facebook',
                // 'github',
                //'apple',
                // 'linkedin',
                //'twitter',
                //'twitch'
              ].map((provider: AuthProvider, index) => (
                <LoginProviderButton
                  key={index}
                  {...{
                    onClick: () => resolve(`oreid-${provider}`),
                    provider,
                    className: 'btn'
                  }}
                />
              ))}
            </>
          ),
          showConfirmButton: false
        });
      }),
    [reactSwal]
  );

  const connectUserData = useCallback(async () => {
    dispatch(setLoginProcessStatus(true));
    let loginData: {
      address: string | undefined;
      blockchain: BlockchainType | undefined;
      idToken?: string;
      provider?: string;
    };
    const dispatchStack = [];
    const loginMethod: string = await selectMethod();
    const [loginConnection, oreIdProvider] = loginMethod.split('-');
    reactSwal.close();
    switch (loginConnection) {
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
    if (!loginData.address || loginData.address === '') {
      reactSwal.fire('Error', 'No user address found', 'error');
      dispatch(setLoginProcessStatus(false));
      return;
    }

    dispatchStack.push(
      setChainId(
        loginData.blockchain,
        loginConnection === 'oreid' ? loginData.address : undefined
      )
    );

    let firstTimeLogin = false;

    try {
      // Check if user exists in DB
      const userDataResponse = await axios.get<TUserResponse>(
        `/api/users/${loginData.address}`
      );
      let user = userDataResponse.data.user;
      if (!userDataResponse.data.success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        // console.info('Address is not registered!');
        firstTimeLogin = true;
        const userCreation = await axios.post<TUserResponse>(
          '/api/users',
          JSON.stringify({ publicAddress: loginData.address }),
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
        if (loginConnection === 'oreid') {
          loginResponse = await rFetch('/api/v2/auth/oreId', {
            method: 'POST',
            body: JSON.stringify({
              idToken: loginData.idToken
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
              `/api/v2/users/${loginData.address.toLowerCase()}`,
              {
                email: oreIdUserData.email,
                nickName: oreIdUserData.username,
                firstName: userName.slice(0, userName.length / 2).join(' '),
                lastName: userName.slice(userName.length / 2).join(' ')
              }
            );
            user = newUserResponse.data.user;
          }
        } else {
          loginResponse = await signWeb3Message(
            programmaticProvider,
            loginData.address
          );
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
    reactSwal,
    adminRights,
    currentUserAddress,
    programmaticProvider,
    dispatch
  ]);

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
        console.info(user);
        if (user.oreId) {
          const { address, blockchain } = await loginWithOreIdToken(user.oreId);
          console.info(address, blockchain);
          dispatch(setChainId(blockchain, address));
          dispatch(setLoginType('oreid'));
        } else {
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
