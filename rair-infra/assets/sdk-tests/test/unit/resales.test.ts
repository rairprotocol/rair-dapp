const { serverURL, User_Address } = require('../test-util');
//import Api from '../src/common/Api';
import { ResalesAPI } from '../../src/API/resales';
//console.log(process.env.SERVER_URL)

const _resales = new ResalesAPI(serverURL, "resales");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('List all open resale offers', async () => {
    const __resales = await _resales.openOffers({blockchain: '0x2105'});
    expect(__resales.data[0].seller).toEqual(User_Address);
  });


});
