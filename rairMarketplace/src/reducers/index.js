import { RAIR_PEPE_BOUGHT, YOUR_PEPE_ADDED, WEB3_CONNECTED, RAIR_PEPE_ADDED, RAIR_PEPE_CONTRACT_INSTANTIATED, RAIR_PEPE_FETCHED, CONTRACT_OWNER, SIGNED_IN_ACCOUNT, defaultState } from '../actions';

const RAIRPepe = (state = defaultState, action) => {
  switch (action.type) {
    case WEB3_CONNECTED:
      return {
        ...state,
        web3: action.payload
      };

    case RAIR_PEPE_CONTRACT_INSTANTIATED:
      return {
        ...state,
        PEPEContract: action.payload
      };

    case RAIR_PEPE_FETCHED:
      return {
        ...state,
        RAIRPepe: action.payload
      };
    case RAIR_PEPE_BOUGHT:
      return {
        ...state,
        yourPEPE: [
          ...state.yourPEPE,
          action.payload
        ]
      };

    case RAIR_PEPE_ADDED:
      return {
        ...state,
        RAIRPepe: [
          ...state.RAIRPepe,
          action.payload
        ]
      };

    case YOUR_PEPE_ADDED:
      return {
        ...state,
        yourPEPE: action.payload
      };

    case CONTRACT_OWNER:
      return {
        ...state,
        contractOwner: action.payload
      };

    case SIGNED_IN_ACCOUNT:
      return {
        ...state,
        signedInAccount: action.payload
      };
      
    default:
      return state
    }
};

export default RAIRPepe;