/* eslint-disable no-case-declarations */
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
  const responseData = await axios.get<TUserResponse>(
    `/api/users/${currentUser}`
  );

  const { success } = responseData.data;
  if (!success) {
    return;
  }
  const loginResponse = await signWeb3Message(currentUser);
  return loginResponse?.success;
};

const signWeb3Message = async (
  userAddress?: string,
  method: 'programmatic' | 'metamask' | 'web3auth' = 'metamask',
  signTypedData?: any,
  ownerAddress?: string
) => {
  try {
    const responseData = await axios.post<TAuthGetChallengeResponse>(
      `/api/auth/get_challenge/`,
      {
        userAddress,
        intent: 'login',
        ownerAddress
      }
    );
    const { response } = responseData.data;

    // Prepare signed message response
    let ethResponse;

    switch (method) {
      case 'programmatic':
        if (signTypedData) {
          const parsedResponse = JSON.parse(response);
          ethResponse = await signTypedData(
            parsedResponse.domain,
            parsedResponse.types,
            parsedResponse.message
          );
        }
        break;
      case 'metamask':
        if (window.ethereum) {
          const ethRequest = {
            method: 'eth_signTypedData_v4',
            params: [userAddress, response],
            from: userAddress
          };
          ethResponse = await window?.ethereum?.request(ethRequest);
        }
        break;
      case 'web3auth':
        if (signTypedData) {
          const parsedResponse = JSON.parse(response);
          ethResponse = await signTypedData(parsedResponse);
        }
        const loginResponse = await rFetch('/api/auth/loginSmartAccount', {
          method: 'POST',
          body: JSON.stringify({
            MetaMessage: JSON.parse(response).message.challenge,
            MetaSignature: ethResponse,
            userAddress
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const { success, user } = loginResponse;
        if (!success) {
          Swal.fire('Error', `Web3Login failed`, 'error');
          return;
        }
        return { success, user };
      default:
        await Swal.fire('Error', "Can't sign messages", 'error');
        return;
    }

    if (ethResponse) {
      const loginResponse = await rFetch('/api/auth/login', {
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
        Swal.fire('Error', `Login failed`, 'error');
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
