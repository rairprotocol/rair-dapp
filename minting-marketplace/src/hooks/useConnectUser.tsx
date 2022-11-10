//@ts-nocheck
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { TUserResponse } from '../axios.responseTypes';
import { OnboardingButton } from '../components/common/OnboardingButton/OnboardingButton';
import { getTokenComplete, getTokenStart } from '../ducks/auth/actions';
import { setChainId, setUserAddress } from '../ducks/contracts/actions';
import { setAdminRights } from '../ducks/users/actions';
import { getJWT, isTokenValid } from '../utils/rFetch';

const rSwal = withReactContent(Swal);

const useConnectUser = () => {
  const dispatch = useDispatch();
  const [startedLogin, setStartedLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState();
  const [loginDone, setLoginDone] = useState<boolean>(false);
  const { programmaticProvider } = useSelector((store) => store.contractStore);
  const { adminRights } = useSelector((store) => store.userStore);

  const connectUserData = useCallback(async () => {
    setStartedLogin(true);
    let currentUser;
    const dispatchStack = [];
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      dispatchStack.push(setUserAddress(accounts[0]));
      dispatchStack.push(setChainId(window.ethereum.chainId?.toLowerCase()));
      currentUser = accounts[0];
    } else if (programmaticProvider) {
      dispatchStack.push(setUserAddress(programmaticProvider.address));
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
      const userData = await axios.get<TUserResponse>(
        `/api/users/${currentUser}`
      );
      const { success, user } = userData.data;
      if (!success || !user) {
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
        const { user } = userCreation.data;
        setUserData(user);
      } else {
        setUserData(user);
      }

      // Authorize user and get JWT token
      if (
        adminRights === null ||
        adminRights === undefined ||
        !localStorage.token ||
        !isTokenValid(localStorage.token)
      ) {
        dispatchStack.push(getTokenStart());
        const token = await getJWT(programmaticProvider, currentUser);

        if (!success) {
          setStartedLogin(false);
          setLoginDone(false);
          dispatchStack.push(setAdminRights(false));
          dispatchStack.push(getTokenComplete(token));
          localStorage.setItem('token', token);
        } else {
          const decoded = jsonwebtoken.decode(token);
          dispatchStack.push(setAdminRights(decoded.adminRights));
          dispatchStack.push(getTokenComplete(token));
          localStorage.setItem('token', token);
        }
      }

      setStartedLogin(false);
      dispatchStack.forEach((dispatchItem) => {
        dispatch(dispatchItem);
      });
      setLoginDone(true);
    } catch (err) {
      console.error('Error', err);
      setStartedLogin(false);
    }
  }, [programmaticProvider, adminRights, dispatch]);

  return {
    startedLogin,
    userData,
    loginDone,
    setLoginDone,
    connectUserData
  };
};

export default useConnectUser;
