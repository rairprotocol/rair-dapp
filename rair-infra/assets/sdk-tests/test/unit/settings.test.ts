const { serverURL } = require('../test-util');
//import Api from '../src/common/Api';
import { SettingsAPI } from '../../src/API/settings';
//console.log(process.env.SERVER_URL)

const _settings = new SettingsAPI(serverURL, "settings");


//_settings.getTheming().then(console.log);

jest.setTimeout(50000);
describe('Unit tests', () => {

  it('Get settings', async () => {
    const __settings = await _settings.getSettings()
    expect(__settings.settings.signupMessage).toContain("Welcome");
   });

  it('Get Theming', async () => {
    const __settings = await _settings.getTheming()
    expect(__settings.success).toBeTruthy;
   });

  it('Get Featured Collection', async () => {
    const __settings = await _settings.getFeaturedCollection()
    expect(__settings.data.collectionName).toContain("RAIR Free License");
   });

  it.skip('Set Settings', async () => {
    const __settings = await _settings.setSetting({darkModeText: "", onlyMintedTokensResult: false, demoUploadsEnabled: true, nodeAddress: ""})
    expect(__settings.success).toBeTruthy;
   });


  it.skip('Add Blockchain', async () => {
    const __settings = await _settings.addBlockchain({hash: '0x1', name: "Ethereum", alchemySupport: false})
    expect(__settings.success).toBeTruthy;
   });

  it.skip('Modify Blockchain', async () => {
    const __settings = await _settings.modifyBlockchain({hash: '0x1', name: "Ethereum", alchemySupport: false})
    expect(__settings.success).toBeTruthy;
   });

  it.skip('Delete Blockchain', async () => {
    const __settings = await _settings.removeBlockchain({hash: '0x1'})
    expect(__settings.success).toBeTruthy;
   });

});
