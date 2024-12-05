const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { NotificationsAPI  } from '../../src/API/notifications';
//console.log(process.env.SERVER_URL)

const _notifications = new NotificationsAPI(serverURL, "notifications");

//categories.getCategories().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it.skip('Fetch a list of notifications for the user', async () => {
    const __notifications = await _notifications.listNotifications({onlyUnread: true});
    expect(__notifications.totalCount).toEqual('10'); 
  });

  it.skip('Fetch a single notification', async () => {
    const __notifications = await _notifications.getSingleNotification({id: '43223423'});
    expect(__notifications.success).toEqual('10'); 
  });

  it.skip('mark the notification as read', async () => {
    const __notifications = await _notifications.markNotificationAsRead({ids: ["66a39c2f24fe94ba7079691c"]});
    expect(__notifications.updated).toEqual(1); 
  });

  it.skip('Delete notification', async () => {
    const __notifications = await _notifications.deleteNotification({ids: ["66a39c2f24fe94ba7079691c"]});
    expect(__notifications.deleted).toEqual(1); 
  });

});
