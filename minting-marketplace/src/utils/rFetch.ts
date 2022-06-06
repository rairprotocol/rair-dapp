//@ts-nocheck
import Swal from 'sweetalert2';
import * as ethers from 'ethers';
import jsonwebtoken from 'jsonwebtoken';
import axios from 'axios';
import { TAuthenticationType, TAuthGetChallengeResponse, TUserResponse } from '../axios.responseTypes';
// import { useSelector } from 'react-redux'

const signIn = async (provider) => {
    let currentUser = provider?.address;
    if (window.ethereum) {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        currentUser = accounts[0];
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

    const responseData = await axios.get<TUserResponse>(`/api/users/${currentUser}`);

    const { success } = responseData.data;
    if (!success) {
        return;
    }
    if (!localStorage.token) {
        let signer = provider;
        if (window.ethereum) {
            signer = new ethers.providers.Web3Provider(window.ethereum);
            // signer = ethProvider.getSigner();
        }
        let token = await getJWT(signer, currentUser);
        if (token) {
            localStorage.setItem('token', token);
            return true;
        }
    }
    return false;
}

const getJWT = async (signer, userAddress) => {
    try {
        const responseData = await axios.get<TAuthGetChallengeResponse>(`/api/auth/get_challenge/${ userAddress }`);

        const { response } = responseData.data;
        let ethResponse;
        let ethRequest = {
            method: 'eth_signTypedData_v4',
            params: [userAddress, response],
            from: userAddress
        };
        if (window.ethereum) {
            ethResponse = await window.ethereum.request(ethRequest);
        } else if (signer) {
            let parsedResponse = JSON.parse(response);

            // EIP712Domain is added automatically by Ethers.js!
            let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
            ethResponse = await signer._signTypedData(
                parsedResponse.domain,
                revisedTypes,
                parsedResponse.message);
        } else {
            await Swal.fire('Error', 'Can\'t sign messages', 'error');
            return;
        }

        if (userAddress) {
            const responseUserdata = await axios.get<TAuthenticationType>(`/api/auth/authentication/${ JSON.parse(response).message.challenge }/${ ethResponse }/`);

            const { success, token } = responseUserdata.data;

            if (!success) {
                return Swal.fire('Error', `${ token }`, 'error');
            } else {
                if (!token) {
                    return 'no token';
                }

                return token;
            }
        }
    } catch (e) {
        console.log(e);
        return 'no token';
    }
};

// Custom hook for taking jwt token from redux
// const useRfetch = () => {
//  const { token } = useSelector(store => store.accessStore);
//  return async (route, options, retryOptions = undefined) => {
//      const request = await fetch(route, {
//          headers: {
//              ...options?.headers,
//              'X-rair-token': token
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

const rFetch = async (route, options?, retryOptions = undefined, showErrorMessages = true) => {
	let request = await fetch(route, {
		...options,
		headers: {
			...options?.headers,
			'X-rair-token': `${localStorage.getItem('token')}`
		},
	});
	try {
		let parsing = await request.json()
		if (!parsing.success) {
			if (['jwt malformed', 'jwt expired', 'invalid signature'].includes(parsing.message) && (window.ethereum || retryOptions?.provider)) {
				localStorage.removeItem('token');
				let retry = await signIn(retryOptions?.provider);
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
}

const isTokenValid = (token) => {
    if (!token) {
        return "no token";
    }

    const decoded = jsonwebtoken.decode(token);
    if (!decoded) {
        return false;
    }
    if (decoded.exp * 1000 > new Date()) {
        return true
    };
    return false;
}

export { rFetch, signIn, getJWT, isTokenValid, /* useRfetch */ };

