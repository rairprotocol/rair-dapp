const { serverURL, MediaId1, MediaId1_Description, Category_Id1, TokenId1 } = require('../test-util');
//import Api from '../src/common/Api';
import { FilesAPI } from '../../src/API/files';
//console.log(process.env.SERVER_URL)

const _media = new FilesAPI(serverURL, "files");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

//_media.getFileById({id: 'jAL8Q4_I_X3BQYcDwF-_yCPCb4qkTgZ3Jtb1Omcih9MJnw'}).then(console.log);


//console.log(new_user); 

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('List media', async () => {
    const __media = await _media.listMedia({pageNum:1 , itemsPerPage: 10})
    expect(__media.totalNumber).toEqual(1);
   });

  it('Fetch information about a single file', async () => {
    const __media = await _media.getFileById({id: MediaId1})
    expect(__media.file.description).toContain(MediaId1_Description);
   });

  it('List all files under a specific category', async () => {
    const __media = await _media.getFilesByCategory({id: Category_Id1})
    expect(__media.success).toBeTruthy;
   });

  it('Search media files given a token ID', async () => {
    const __media = await _media.getFilesByToken({id: TokenId1})
    expect(__media.results).toEqual(0);
   });

  it('Get all offers associated with a file', async () => {
    const __media = await _media.getOffersByFile({id: MediaId1})
    expect(__media.success).toBeTruthy;
   });


});
