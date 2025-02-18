const { serverURL } = require('../test-util');
//const request = require('supertest');

//request('https://dog.ceo')

//import Api from '../src/common/Api';
import { CategoriesAPI } from '../../src/API/categories';
//console.log(process.env.SERVER_URL)

const _categories = new CategoriesAPI(serverURL, "categories");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('checks if category matches', async () => {
    const __categories = await _categories.getCategories();
    expect(__categories.result[0].name).toEqual('Music');
  });

  it.skip('update category', async () => {
    const __categories = await _categories.updateCategory({list: []});
    expect(__categories.result[0].name).toEqual('Music'); 
  });


});
