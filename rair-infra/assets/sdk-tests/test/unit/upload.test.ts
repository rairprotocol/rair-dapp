const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { UploadAPI } from '../../src/API/upload';
//console.log(process.env.SERVER_URL)

const _upload = new UploadAPI(serverURL, "upload");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

   it('getUploadToken', async () => {
    const __upload = await _upload.getUploadToken(); 
    expect(__upload.success).toBeFalsy; 
   });

});
