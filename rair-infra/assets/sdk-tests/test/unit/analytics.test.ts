const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { AnalyticsAPI } from '../../src/API/analytics';
//console.log(process.env.SERVER_URL)

const _analytics = new AnalyticsAPI(serverURL, "analytics");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it.skip('Get the analytics report for a specific file', async () => {
    const __analytics = await _analytics.fromMedia({mediaId: 'NSdkxJPPY5FAfBMJtZhdnC8wQbExevzJMJQa8NAIEGDGu6'});
    expect(__analytics.totalCount).toEqual('3');
  });

  it.skip('Get the analytics report for a specific file in downloadable CSV form', async () => {
    const __analytics = await _analytics.fromMediaAsCSV({mediaId: 'NSdkxJPPY5FAfBMJtZhdnC8wQbExevzJMJQa8NAIEGDGu6'});
    expect(__analytics.totalCount).toEqual('3');
  });


});
