const axios = require('axios');

class VaultAppRoleIntegration {
  async constructor() {
    this.token = null;
    this.newToken = null;

    this.tokenRenewalTimer = null;
    this.tokenRenewalTimerInterval = null;

    // fire the initial call to get token
    // when class is fisrt instantiated
    await this.getTokenWithAppRoleCreds();
    console.log('GET TOKEN')
    console.log(this.getToken);
  }

  getAppRoleIDFromEnv() {
    return process.env.APP_ROLE_ID
  }

  getAppRoleSecretIDFromEnv() {
    return process.env.APP_ROLE_SECRET_ID
  }

  getVaultURL() {
    return process.env.VAULT_URL
  }

  getAppRoleLoginURL() {
    return this.getVaultURL() + "/v1/auth/approle/login"
  }

  async getTokenWithAppRoleCreds() {
    try {
      // pull app role ROLE ID environment
      const appRoleID = this.getAppRoleIDFromEnv();

      // pull app role SECRET ID from environment
      const appRoleSecretID = this.getAppRoleSecretIDFromEnv()

      // Pull vault URL from environment
      const vaultURL = this.getVaultURL();
      
      // make login query to Vault
      const res = await axios({
        method: 'POST',
        url: this.getAppRoleLoginURL(),
        headers: {
          "X-Vault-Request": true,
          "X-Vault-Namespace": "admin/",
        },
        data: {
          role_id: appRoleID,
          secret_id: appRoleSecretID
        }
      });
      
      // curl 
      // -X PUT 
      // -H "X-Vault-Request: true" 
      // -H "X-Vault-Namespace: admin/" 
      // -H "X-Vault-Token: $(vault print token)" 
      // -d '{"role_id":"453d2063-f868-aa55-b776-b983b9ab6756","secret_id":"de3961f8-a9f6-96bf-b05c-4b974800d577"}'
      // https://primary-dev.vault.9871e6c3-b0b9-479a-b392-eb69322d192a.aws.hashicorp.cloud:8200/v1/auth/approle/login

      console.log('res ---------------', res);
      console.log('res', res.status);
      console.log('res', res.text);

      if(res.status !== 200) {
        throw new Error('Error getting token!');
      }
      // console.log('res', res.toJSON());
      

      // pull from API response
      const {client_token} = res.data.auth

      // save token in this class
      this.saveToken(client_token)

      // TODO: start timer to do it again

    } catch(err) {
      console.log('ERROR', err);
    }
  }

  startRenewalTimer() {
    if(this.tokenRenewalTimerInterval === null) throw new Error('Vault token renewal timer is null!');
    const passedThis = this;
    this.tokenRenewalTimer = setInterval(() => {
      passedThis.renewToken();
    }, this.tokenRenewalTimerInterval);
  }

  saveToken(token) {
    // save token into class storage
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  renewToken() {
    // make call to get new token using existing token
    if(this.token === null) throw new Error('Existing token is null!');

    // make an api call to get the new token
  }
}

// instantiate one class and export it
// we only want one instance of this in the app
const vaultAppRoleIntegration = new VaultAppRoleIntegration()