const { serverURL, User_Address } = require('../test-util');
//import Api from '../src/common/Api';
import { UsersAPI } from '../../src/API/users';
//console.log(process.env.SERVER_URL)

const _user = new UsersAPI(serverURL, "users");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

//_user.listUsers({itemsPerPage: 8, pageNum: 0, fields: ['publicAddress, nickName']}).then(console.log);

var crypto = require('crypto');
const randomString = crypto.randomBytes(20).toString("hex");

console.log(randomString); 

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('List users', async () => {
    const __user = await _user.listUsers({itemsPerPage: 8, pageNum: 0, fields: ['publicAddress, nickName'] })
    expect(__user.data[0].publicAddress).toEqual(User_Address);
   });

  it.skip('exportUserData', async () => {
    const __user = await _user.exportUserData()
    expect(__user).toContain("user");
   });

  it.skip('Verify Age', async () => {
    //const __user = await _user.verifyAge({file: test.jpg})
    //expect(__user.success).toBeFalsy;
   });

  it('create new user', async () => {
    const __user = await _user.createUser({publicAddress: `0x${randomString}`}) 
    expect(__user.user.publicAddress).toEqual((`0x${randomString}`).toLowerCase()); 
   });

  it('checks if user details  matches', async () => {
   const __user = await _user.findUserByUserAddress({publicAddress: User_Address}) 
   expect(__user.user.publicAddress).toEqual((User_Address).toLowerCase()); 
  });

  it.skip('Update user details', async () => {
    const __user = await _user.updateUserByUserAddress({publicAddress: User_Address, nickName: 'qa-update'}) 
    expect(__user.user.nickName).toEqual(('qa-update'));
   });


});
