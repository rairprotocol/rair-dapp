const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { OffersAPI } from '../../src/API/offers';
//console.log(process.env.SERVER_URL)

const _offers = new OffersAPI(serverURL, "offers");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('getAllOffers', async () => {
    const __offers = await _offers.getAllOffers({contract: '6731bc09ca3b458d029362fd'}); 
    expect(__offers.results).toEqual((1)); 
   });

   it.skip('getAvailableOffers', async () => {
    const __offers = await _offers.getAvailableOffers({id: '67351be174592808d65dfed6'}); 
    expect(__offers.availableTokens).toEqual((50)); 
   });

});
