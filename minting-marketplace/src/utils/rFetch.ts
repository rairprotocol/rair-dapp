import axios from 'axios';
import { providers } from 'ethers';
import Swal from 'sweetalert2';

import {
  TAuthGetChallengeResponse,
  TUserResponse
} from '../axios.responseTypes';

const signIn = async (provider: providers.StaticJsonRpcProvider) => {
  let currentUser = provider?.getSigner()._address;
  if (!provider && window.ethereum) {
    provider = new providers.Web3Provider(window.ethereum);
  }
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    currentUser = accounts && accounts[0];
  }
  if (!currentUser) {
    console.error('No address');
    return;
  }
  /*
    // Check if user exists in DB
    if (!success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        console.log('Address is not registered!');
        const userCreation = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ publicAddress: currentUser, adminNFT: 'temp' }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log('User Created', userCreation);
    //  setUserData(userCreation);
    } else {
    //  setUserData(user);
    }

    // Admin rights validation
    let adminRights = adminAccess;
    if (adminAccess === undefined) {
        const { response } = await (await fetch(`/api/auth/get_challenge/${currentUser}`)).json();
        const ethResponse = await window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [currentUser, response],
            from: currentUser
        });
        const adminResponse = await (await fetch(`/api/auth/admin/${ JSON.parse(response).message.challenge }/${ ethResponse }/`)).json();
        setAdminAccess(adminResponse.success);
        adminRights = adminResponse.success;
    }
  */
  const responseData = await axios.get<TUserResponse>(
    `/api/users/${currentUser}`
  );

  const { success } = responseData.data;
  if (!success) {
    return;
  }
  const signer = provider.getSigner();
  const loginResponse = await signWeb3Message(signer, currentUser);
  return loginResponse?.success;
};

const signWeb3Message = async (
  signer: providers.JsonRpcSigner,
  userAddress: string | undefined
) => {
  try {
    const responseData = await axios.post<TAuthGetChallengeResponse>(
      `/api/auth/get_challenge/`,
      {
        userAddress,
        intent: 'login'
      }
    );

    const { response } = responseData.data;
    let ethResponse;
    const ethRequest = {
      method: 'eth_signTypedData_v4',
      params: [userAddress, response],
      from: userAddress
    };
    if (window.ethereum) {
      ethResponse = await window.ethereum.request(ethRequest);
    } else if (signer) {
      const parsedResponse = JSON.parse(response);

      // EIP712Domain is added automatically by Ethers.js!
      const { /*EIP712Domain,*/ ...revisedTypes } = parsedResponse.types;
      ethResponse = await signer._signTypedData(
        parsedResponse.domain,
        revisedTypes,
        parsedResponse.message
      );
    } else {
      await Swal.fire('Error', "Can't sign messages", 'error');
      return;
    }
    if (ethResponse) {
      const loginResponse = await rFetch('/api/v2/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          MetaMessage: JSON.parse(response).message.challenge,
          MetaSignature: ethResponse
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { success, user } = loginResponse;

      if (!success) {
        Swal.fire('Error', ``, 'error');
        return;
      }
      return { success, user };
    }
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

// Custom hook for taking jwt token from redux
// const useRfetch = () => {
//  const { token } = useSelector(store => store.accessStore);
//  return async (route, options, retryOptions = undefined) => {
//      const request = await fetch(route, {
//          headers: {
//              ...options?.headers
//          },
//          ...options
//      });
//      try {
//          let parsing = await request.json()
//          if (!parsing.success) {
//              if (['jwt malformed', 'jwt expired'].includes(parsing.message) && (window.ethereum || retryOptions?.provider)) {
//                  localStorage.removeItem('token');
//                  let retry = await signIn(retryOptions?.provider);
//                  if (retry) {
//                      return rFetch(route, options);
//                  }
//              }
//              Swal.fire('Error', parsing?.message, 'error');
//          }
//          return parsing;
//      } catch (err) {
//          console.error(request, err);
//      }
//      return request;
//  }
// }

const rFetch = async (
  route: string,
  options?: RequestInit,
  retryOptions: any = undefined,
  showErrorMessages = true
) => {
  const request = await fetch(route, {
    ...options,
    headers: {
      ...options?.headers
    }
  });
  try {
    const parsing = await request.json();
    if (!parsing.success) {
      if (
        [
          'jwt malformed',
          'jwt expired',
          'invalid signature',
          'Authentication failed, please login again'
        ].includes(parsing.message) &&
        (window.ethereum || retryOptions?.provider)
      ) {
        localStorage.removeItem('token');
        const retry = await signIn(retryOptions?.provider);
        if (retry) {
          return rFetch(route, options);
        }
      }
      if (showErrorMessages) {
        Swal.fire('Error', parsing?.message, 'error');
      }
    }
    return parsing;
  } catch (err) {
    console.error(request, err);
  }
  return request;
};

export { /* useRfetch */ rFetch, signIn, signWeb3Message };
