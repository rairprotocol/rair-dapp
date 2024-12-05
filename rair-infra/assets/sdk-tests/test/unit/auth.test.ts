const { serverURL, User_Address, User_NickName, MediaId1 } = require('../test-util');
//import Api from '../src/common/Api';
import { AuthAPI } from '../../src/API/auth';
import { Intents, FileTypes } from '../../src/types/auth';
//console.log(process.env.SERVER_URL)

const _auth = new AuthAPI(serverURL, "auth");

let __challenge = "";

//_auth.getChallenge({userAddress: User_Address, intent: Intents['Login']}).then(console.log);

jest.setTimeout(50000);
describe('E2E integration tests', () => {

  it('checks if getChallenge matches', async () => {
    const __auth = await _auth.getChallenge({userAddress: User_Address, intent: Intents['Login']});
    expect(__auth.response).toContain('EIP712Domain');
    const _challenge = JSON.parse(__auth.response);
    //console.log(_challenge)
    __challenge = _challenge.message["challenge"]
    //console.log(__challenge)
  });
  
  it.skip('Login web3', async () => {
    console.log(__challenge)
    const __auth = await _auth.loginWeb3({MetaMessage: "__challenge", MetaSignature: '0x0d625145ecf9d89d3a1cc8195a9770626f0e695f636c261cda1255e680ccb17c5cf5c307d394f8d633cd9ad8a418d7f09ad602bde6abf690785a9c4612f679cb1c', userAddress: User_Address});
    expect(__auth.user.nickName).toContain(User_NickName);
  });

  it.skip('Get the signature challenge to login into the system with web3Auth', async () => {
    //console.log(__challenge)
    const __auth = await _auth.loginSmartAccount({MetaMessage: "__challenge", MetaSignature: '0x0d625145ecf9d89d3a1cc8195a9770626f0e695f636c261cda1255e680ccb17c5cf5c307d394f8d633cd9ad8a418d7f09ad602bde6abf690785a9c4612f679cb1c', userAddress: User_Address});
    expect(__auth.user.nickName).toContain(User_NickName);

  });


  it('Closes the current users session in the system', async () => {
    const __auth = await _auth.logout();
    expect(__auth.success).toBeTruthy;
  });

  it('Returns the information of the current user', async () => {
    const __auth = await _auth.currentUser();
    expect(__auth).toBeFalsy;
  });

  it('Stops any file stream', async () => {
    const __auth = await _auth.endFileStream();
    expect(__auth.success).toBeTruthy;
  });

  it.skip('Verify NFT ownership to unlock media file', async () => {
    const __auth = await _auth.unlock({type: FileTypes['file'], fileId: MediaId1});
    expect(__auth.success).toBeFalsy;
  });

});