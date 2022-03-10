const axios = require('axios');
const auth = require('../routes/auth');

class VaultAppRoleTokenManager {
  constructor() {
    // token that we pulled from Vault App role login
    this.token = null;
    this.authData = null

    // setTimeout object reference
    this.tokenRenewalTimeout = null;

    // fire the initial call to get token
    // when class is fisrt instantiated
    this.getTokenWithAppRoleCreds()
    .then(() => {
      console.log('Initial app role login suceeded');
    })
    .catch(() => {
      console.log('err', err);
    })
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

  getTokenRenewSelfUrl() {
    return this.getVaultURL() + "/v1/auth/token/renew-self"
  }

  getVaultNamespace() {
    return "admin/"
  }

  async getTokenWithAppRoleCreds() {
    try {
      // make login query to Vault
      const res = await axios({
        method: 'POST',
        url: this.getAppRoleLoginURL(),
        headers: {
          "X-Vault-Request": true,
          "X-Vault-Namespace": this.getVaultNamespace(),
        },
        data: {
          role_id: this.getAppRoleIDFromEnv(),
          secret_id: this.getAppRoleSecretIDFromEnv()
        }
      });

      if(res.status !== 200) {
        throw new Error('Error getting token! Received non 200 code from App Role Login url');
      }

      // pull from API response
      const { auth } = res.data;

      // save token in this class
      this.saveAuthData(auth)

      // start timer to do it again
      this.startRenewalTimeout({
        leaseDurationSeconds: auth.lease_duration
      })

    } catch(err) {
      console.log('ERROR executing getTokenWithAppRoleCreds:', err);
    }
  }

  startRenewalTimeout({leaseDurationSeconds}) {
    // clear timeout reference if we have one
    if(this.tokenRenewalTimeout !== null) {
      clearTimeout(this.tokenRenewalTimeout);
    }

    const halfOfLeaseDuration = (leaseDurationSeconds / 2) * 1000

    this.tokenRenewalTimeout = setTimeout(() => {
      this.renewToken();
    }, halfOfLeaseDuration);
  }

  saveAuthData(authData) {
    console.log('save auth data', authData)
    this.authData = authData;
  }

  getToken() {
    if(this.authData === null) {
      return null;
    } else {
      return this.authData.client_token;
    }
  }

  async renewToken() {
    try {
      // make call to get new token using existing token
      if(this.token === null) throw new Error('Existing token is null!');

      const res = await axios({
        method: 'POST',
        url: this.getTokenRenewSelfUrl(),
        headers: {
          "X-Vault-Request": true,
          "X-Vault-Namespace": this.getVaultNamespace(),
          "X-Vault-Token": this.token
        },
        data: {
          "increment": 0      
        }
      });
      
      if(res.status !== 200) {
        throw new Error('Error renewing token, received non 200 code trying to renew self.')
      }

      const { auth } = res.data;
      this.saveAuthData(res.data.auth)

      this.startRenewalTimeout({
        leaseDurationSeconds: auth.lease_duration
      })

    } catch(err) {
      console.log('Error renewing token:', err);
    }
  }
}

// instantiate one class and export it
// we only want one instance of this in the app
const vaultAppRoleTokenManager = new VaultAppRoleTokenManager()