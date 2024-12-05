const { serverURL, User_Address } = require('../test-util');
//import Api from '../src/common/Api';
import { ProductsAPI } from '../../src/API/products';
//console.log(process.env.SERVER_URL)

const _products = new ProductsAPI(serverURL, "products");

//user.findUserByUserAddress({publicAddress: `0x8B1b77BF1a23951Ae0F1dff8162C5A67632aF224`}).then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

   it('listProduts', async () => {
    const __products = await _products.listProduct({}); 
    expect(__products.results).toEqual((27)); //total products in Database
   });

   it('Get all products from an user', async () => {
    const __products = await _products.getProductsByUser({userAddress: User_Address}); 
    expect(__products.products[0].copies).toEqual(500); 
   });


});
