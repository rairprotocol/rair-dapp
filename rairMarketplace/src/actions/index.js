import Web3 from 'web3';
import contract from 'truffle-contract';
import PEPEContact from 'smart_contracts/build/contracts/PEPE.json';
export const WEB3_CONNECTED = 'WEB3_CONNECTED';
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED';
export const RAIR_PEPE_CONTRACT_INSTANTIATED = 'RAIR_PEPE_CONTRACT_INSTANTIATED';
export const RAIR_PEPE_FETCHED = 'RAIR_PEPE_FETCHED';
export const RAIR_PEPE_ADDED = 'RIAR_PEPE_ADDED';
export const CONTRACT_OWNER = 'CONTRACT_OWNER';
export const SIGNED_IN_ACCOUNT = 'SIGNED_IN_ACCOUNT';
export const YOUR_PEPE_ADDED = 'YOUR_PEPE_ADDED';
export const RAIR_PEPE_BOUGHT = 'RAIR_PEPE_BOUGHT';

export const defaultState = {
    web3: null,
    PEPEContract: [],
    RAIRPepe: [],
    yourPEPE: []
};

export function web3connect() {
    return (dispatch) => {
        const web3 = window.web3;

        if (typeof web3 !== 'undefined') {
            dispatch({
                type: WEB3_CONNECTED,
                payload: new Web3(web3.currentProvider)
            });
        } else {
          dispatch({
              type: WEB3_CONNECTED,
              payload: new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
          });
        };
    };
}

export function instantiateRAIRPEPEContract() {
    return (dispatch, getState) => {
        const web3 = getState().web3;
        const rairContract = contract(PEPEContact);
        rairContract.setProvider(web3.currentProvider);
        return rairContract.deployed().then((contractInstance) => {
            dispatch({
                type: RAIR_PEPE_CONTRACT_INSTANTIATED,
                payload: contractInstance 
            });
        });
    };
}

export function fetchPEPE(forContract) {
    return (dispatch, getState) => {
        const state = getState();
        const web3 = state.web3;
        const rairContract = state.rairContract;
        web3.eth.getAccounts((err, accounts) => {
            rairContract.tokensOf(
                forContract ? rairContract.address : accounts[0]
            ).then((PEPE) => {
                Promise.all(
                //Super Power On
                    PEPE.map(rair => rairContract.getIpfsHash(rair))
                ).then(values => {
                    let i = 0;
                    dispatch({
                        type:forContract ? RAIR_PEPE_FETCHED : YOUR_PEPE_ADDED,
                        payload: values.map((value) => {
                            return { 
                              url: `http://localhost:8080/ipfs/${value}`,
                              id: PEPE[i++].toNumber()
                            }
                        })
                    });
                });
            });
        });
    };
}

export function mintPEPE(payload) {
    return (dispatch, getState) => {
        const web3 = getState().web3;
        const rairContract = getState().rairContract;
        web3.eth.getAccounts((err, accounts) => {
            rairContract.mint(
                payload.hash || "",
                payload.price || web3.toWei(.001, "ether"), {
                from: accounts[0]
            }).then((results) => {
                dispatch({
                    type: RAIR_PEPE_ADDED,
                    payload: {
                        url: `http://localhost:8080/ipfs/${payload.hash}`,
                        id: results.logs[0].args._tokenId.toNumber()
                    }
                });
            });
        });
    };
}

export function buyPEPE(payload) {
    return (dispatch, getState) => {
        const web3 = getState().web3;
        const rairContract = getState().rairContract;
        const RAIRPepe = getState().RAIRPepe;
        web3.eth.getAccounts((err,accounts) => {
            rairContract.buyPEPE(Number(payload.id), {
                form: accounts[0],
                value: new web3.BigNumber(web3.toWei(.001, "ether"))
            }).then((results) => {
                let newAvailablePEPE = RAIRPepe.filter(rair => rair.id !== results.logs[0].args._tokenId.toNumber())
                return dispatch => {
                    dispatch({
                        type: RAIR_PEPE_BOUGHT,
                        payload: {
                            id: results.logs[0].args._tokenID.toNumber(),
                            url: payload.url
                        }
                    })
                    dispatch({
                        type: RAIR_PEPE_FETCHED,
                        payload: newAvailablePEPE
                    })
                }
            });
        });
    };
}

export function owner(payload) {
    return (dispatch, getState) => {
        const web3 = getState().web3;
        const rairContract = getState().rairContract;
        web3.eth.getAccounts((err,accounts) => {
            rairContract.owner({
                from: accounts[0],
            }).then((result) => {
                dispatch({
                    type:CONTRACT_OWNER,
                    payload: result
                });
            });
        });
    };
}

export function wallet(payload){
    return (dispatch, getState) => {
        const web3 = getState().web3;
        web3.eth.getAccounts((err,accounts) => {
            dispatch({
                type: SIGNED_IN_ACCOUNT,
                payload: accounts[0]
            });
        });
    };
}
