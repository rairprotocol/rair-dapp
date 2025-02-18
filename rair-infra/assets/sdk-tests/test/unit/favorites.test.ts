const { serverURL, User_Address } = require('../test-util');
//import Api from '../src/common/Api';
import { FavoritesAPI } from '../../src/API/favorites';
//console.log(process.env.SERVER_URL)

const _favorites = new FavoritesAPI(serverURL, "favorites");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it.skip('Register a token as a favorite', async () => {
    const __favorites = await _favorites.createFavorite({token: '6748a7c84a7fa5cfeb6117d7'});
    expect(__favorites.success).toBeTruthy;
  
  });

  it.skip('List an user favorite tokens', async () => {
    const __favorites = await _favorites.getAllFavoritesForUser({pageNum:1, itemsPerPage:10});
    expect(__favorites.result).toEqual('3');
  });

  it('List favorite token for a user', async () => {
    const __favorites = await _favorites.getAllFavoritesOfAddress({userAddress: User_Address});
    expect(__favorites.success).toBeTruthy;
  });

  it.skip('Delete a favorite record', async () => {
    const __favorites = await _favorites.deleteFavorite({id: '6748a7c84a7fa5cfeb6117d7'});
    expect(__favorites.success).toBeTruthy;
  
  });


});
