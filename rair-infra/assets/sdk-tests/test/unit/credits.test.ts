const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { CreditsAPI } from '../../src/API/credits';
//console.log(process.env.SERVER_URL)

const _credits = new CreditsAPI(serverURL, "credits");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it.skip('Get the analytics report for a specific file', async () => {
    const __credits = await _credits.getUserCredits({blockchain: '0x2105', tokenAddress: '0x762BbcF6E6486fbee13a5CeE291F7aEE14f1CA77'});
    expect(__credits.credits).toEqual('3');
  });


});
