//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { getTokenStart } from '../ducks/auth/actions';
import { setChainId, setUserAddress } from '../ducks/contracts/actions';
import {
  getUserComplete,
  setAdminRights,
  setSuperAdmin
} from '../ducks/users/actions';
import { getJWT, rFetch } from '../utils/rFetch';

const rSwal = withReactContent(Swal);

const useConnectUser = () => {
  const dispatch = useDispatch();
  const [startedLogin, setStartedLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState();
  const [loginDone, setLoginDone] = useState<boolean>(false);
  const { programmaticProvider } = useSelector((store) => store.contractStore);
  const { adminRights } = useSelector((store) => store.userStore);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const connectUserData = useCallback(async () => {
    setStartedLogin(true);
    let currentUser;
    const dispatchStack = [];
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      dispatchStack.push(setChainId(window.ethereum.chainId?.toLowerCase()));
      currentUser = accounts[0];
    } else if (programmaticProvider) {
      dispatchStack.push(
        setChainId(
          `0x${programmaticProvider.provider._network.chainId
            ?.toString(16)
            ?.toLowerCase()}`
        )
      );
      currentUser = programmaticProvider.address;
    } else {
      rSwal.fire({
        title: 'Please install a Crypto wallet',
        html: (
          <div>
            <OnboardingButton />
          </div>
        ),
        icon: 'error'
      });
      setStartedLogin(false);
      return;
    }

    if (!currentUser && currentUser !== undefined) {
      Swal.fire('Error', 'No user address found', 'error');
      setStartedLogin(false);
      return;
    }

    try {
      // Check if user exists in DB
      const userDataResponse = await axios.get<TUserResponse>(
        `/api/users/${currentUser}`
      );
      let user = userDataResponse.data.user;
      if (!userDataResponse.data.success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        console.info('Address is not registered!');
        const userCreation = await axios.post<TUserResponse>(
          '/api/users',
          JSON.stringify({ publicAddress: currentUser }),
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        user = userCreation.data;
      }

      // Authorize user and get JWT token
      if (
        adminRights === null ||
        adminRights === undefined ||
        !currentUserAddress
      ) {
        dispatchStack.push(getTokenStart());
        const loginResponse = await getJWT(programmaticProvider, currentUser);
        if (!userDataResponse.data.success) {
          setStartedLogin(false);
          setLoginDone(false);
          dispatchStack.push(setAdminRights(false));
          setUserData();
        } else if (loginResponse.success) {
          setUserData(user);
          dispatchStack.push(setUserAddress(currentUser));
          dispatchStack.push(getUserComplete(loginResponse.user));
          dispatchStack.push(setAdminRights(loginResponse.user.adminRights));
          dispatchStack.push(setSuperAdmin(loginResponse.user.superAdmin));
          dispatchStack.forEach((dispatchItem) => {
            dispatch(dispatchItem);
          });
          setLoginDone(true);
        }
      }
      setStartedLogin(false);
    } catch (err) {
      console.error('Error', err);
      setStartedLogin(false);
    }
  }, [programmaticProvider, adminRights, currentUserAddress, dispatch]);

  useEffect(() => {
    (async () => {
      const { success, user } = await rFetch(
        '/api/v2/auth/me/',
        undefined,
        undefined,
        false
      );
      if (success && user) {
        setUserData(user);
        dispatch(setUserAddress(user.publicAddress));
        dispatch(getUserComplete(user));
        dispatch(setAdminRights(user.adminRights));
        dispatch(setSuperAdmin(user.superAdmin));
        setLoginDone(true);
        setStartedLogin(false);
      }
    })();
  }, []);

  return {
    startedLogin,
    userData,
    loginDone,
    setLoginDone,
    connectUserData
  };
};

export default useConnectUser;
