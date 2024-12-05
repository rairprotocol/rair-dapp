const { serverURL, Contract_Id1  } = require('../test-util');
//import Api from '../src/common/Api';
import { TokensAPI } from '../../src/API/tokens';
//console.log(process.env.SERVER_URL)

const _tokens = new TokensAPI(serverURL, "tokens");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

   it('getAllTokens', async () => {
    const __tokens = await _tokens.getAllTokens({contract: Contract_Id1}); 
    expect(__tokens.results).toEqual((10000)); 
   });

   it('Get information for a single token', async () => {
      const __tokens = await _tokens.getSingleToken({contract: Contract_Id1, token: '0' , offerPool: '0', offers: '0'}); 
      expect(__tokens.data.doc.ownerAddress).toContain(('0xf3fc93b77a1a39610aa800734dfd017ca293e53d')); 
     });

   it.skip('Get data for a specific token', async () => {
      const __tokens = await _tokens.getFullTokenInfo({id: '67351be174592808d65dfeda'}); 
      expect(__tokens.tokenData.ownerAddress).toContain(('0xf3fc93b77a1a39610aa800734dfd017ca293e53d')); 
     });

});
