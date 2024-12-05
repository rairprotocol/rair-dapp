const { serverURL, User_Address, Contract_Address1 } = require('../test-util');
//import Api from '../src/common/Api';
import { NftAPI } from '../../src/API/nft';
//console.log(process.env.SERVER_URL)

const _nft = new NftAPI(serverURL, "nft");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);
console.log(User_Address)

jest.setTimeout(500000);
describe('Unit tests', () => {

  it('getTokensForUser', async () => {
    const __nft = await _nft.getTokensForUser({userAddress: User_Address}) 
    expect(__nft.totalCount).toEqual((71)); 
   });
  
  
  it.skip('CSV Sample', async () => {
   const __nft = await _nft.getCSVSample() 
   expect(__nft).toContain(('NFT')); 
  });

  it.skip('findTokensForProduct', async () => {
    const __nft = await _nft.findTokensForProduct({
      networkId: "0x2105", contract: Contract_Address1, product: 0}); 
    expect(__nft.totalCount).toEqual((10)); 
   });

   it('findTokenNumbersForProduct', async () => {
    const __nft = await _nft.findTokenNumbersForProduct({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0,
      fromToken: '0',
      toToken: '10'
    }); 
    expect(__nft.success).toBeTruthy; 
   });

   it('findProductAttributes', async () => {
    const __nft = await _nft.findProductAttributes({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0}); 
    expect(__nft.success).toBeTruthy; 
   });

   it('findFilesForProduct', async () => {
    const __nft = await _nft.findFilesForProduct({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0}); 
    expect(__nft.success).toBeTruthy; 
   });

   it('findFilesForTokenInProduct', async () => {
    const __nft = await _nft.findFilesForTokenInProduct({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0, token: 1}); 
    expect(__nft.files[0].description).toEqual(("test")); 
   });


   it('findOffersForProduct', async () => {
    const __nft = await _nft.findOffersForProduct({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0}); 
    expect(__nft.product.copies).toEqual((10000)); 
   });

  it('findLockedOffersForProduct', async () => {
    const __nft = await _nft.findLockedOffersForProduct({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0}); 
    expect(__nft.locks[0].lockedCopies).toEqual((1)); 
   });

   it('findSingleToken', async () => {
    const __nft = await _nft.findSingleToken({
      networkId: "0x2105", contract: "0xfc3666266d129504dd6c713f9bce107747ae4aee", product: 0, token: 1}); 
    expect(__nft.result.ownerAddress).toEqual(("0x9df2f5619e924c2f157b5153a040ab123f5a6420")); 
   });

});
