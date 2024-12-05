const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { SearchAPI } from '../../src/API/search';
//console.log(process.env.SERVER_URL)

const _search = new SearchAPI(serverURL, "search");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('checks if Text Search matches', async () => {
    const __search = await _search.textSearch({textParam: 'Free'});
    expect(__search.data.products[0].name).toEqual('RAIR Free License');
  });

  it('checks if Text Search All matches', async () => {
    const __search = await _search.textSearchAll({textParam: 'user-1'});
    expect(__search.data.users[0].nickName).toContain('@user-1');
  });


});
