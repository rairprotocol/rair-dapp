const axios = require('axios');
const {
  getVaultNamespace,
  getVaultUrl,
  getAppRoleIDFromEnv,
  getAppRoleSecretIDFromEnv,
} = require('./vaultUtils');

class VaultAppRoleTokenManager {
  constructor({appName, preventThrowingErrors}) {
    this.authData = null;
    this.appName = appName;

    this.preventThrowingErrors = preventThrowingErrors;

    // setTimeout object reference
    this.tokenRenewalTimeout = null;
  }

  initialLogin() {
    return new Promise((resolve, reject) => {
      this.getTokenWithAppRoleCreds()
        .then(() => {
          console.log('Initial app role login suceeded');
          resolve();
        })
        .catch(() => {
          const errMessage = "Initial app role login failed!";
          console.log(errMessage);
          reject(new Error(errMessage));
        });
    });
  }

  getAppRoleLoginURL() {
    return `${getVaultUrl()}/v1/auth/approle/login`;
  }

  getTokenRenewSelfUrl() {
    return `${getVaultUrl()}/v1/auth/token/renew-self`;
  }

  async getTokenWithAppRoleCreds() {
    try {
      // make login query to Vault
      const axiosParams = {
        method: 'POST',
        url: this.getAppRoleLoginURL(),
        headers: {
          'X-Vault-Request': true,
          'X-Vault-Namespace': getVaultNamespace(),
        },
        data: {
          role_id: getAppRoleIDFromEnv({appName: this.appName}),
          secret_id: getAppRoleSecretIDFromEnv({appName: this.appName}),
        },
      };
      const res = await axios(axiosParams);
      if (res.status !== 200) {
        const errMessage = 'Error getting token! Received non 200 code from App Role Login url';
        console.log(errMessage);
        if(!this.preventThrowingErrors) {
          throw new Error(errMessage);
        }
      }

      // pull from API response
      const { auth } = res.data;

      // save token in this class
      this.saveAuthData(auth);

      // start timer to do it again
      this.startRenewalTimeout({
        leaseDurationSeconds: auth.lease_duration,
      });
    } catch (err) {
      const errMessage = "VaultAppRoleTokenManager getTokenWithAppRoleCreds failed";
      console.log(errMessage);
      if(!this.preventThrowingErrors) {
        throw new Error(errMessage);
      }
    }
  }

  startRenewalTimeout({ leaseDurationSeconds }) {
    // clear timeout reference if we have one
    if (this.tokenRenewalTimeout !== null) {
      clearTimeout(this.tokenRenewalTimeout);
    }

    const halfOfLeaseDuration = (leaseDurationSeconds / 2) * 1000;

    this.tokenRenewalTimeout = setTimeout(() => {
      try {
        this.renewToken();
      } catch(err) {
        // TODO: VAULT UTILS remove this try/catch block
        // https://rairtech.atlassian.net/browse/RAIR-3285
        const errMessage = 'Error renewing token';
        console.log(errMessage);
        if(!this.preventThrowingErrors) {
          throw new Error(errMessage);
        }
      }
    }, halfOfLeaseDuration);
  }

  saveAuthData(authData) {
    this.authData = authData;
  }

  getToken() {
    if (this.authData === null) {
      return null;
    }
    return this.authData.client_token;
  }

  async renewToken() {
    try {
      // make call to get new token using existing token
      if (this.getToken() === null) {
        const errMessage = 'Existing token is null!';
        console.log(errMessage);
        if(!this.preventThrowingErrors) {
          throw new Error(errMessage);
        }
      }

      const res = await axios({
        method: 'POST',
        url: this.getTokenRenewSelfUrl(),
        headers: {
          'X-Vault-Request': true,
          'X-Vault-Namespace': getVaultNamespace(),
          'X-Vault-Token': this.getToken(),
        },
        data: {
          increment: 0,
        },
      });

      if (res.status !== 200) {
        const errMessage = 'Error renewing token, received non 200 code trying to renew self.';
        console.log(errMessage);
        if(!this.preventThrowingErrors) {
          throw new Error(errMessage);
        }
      }

      const { auth } = res.data;
      this.saveAuthData(res.data.auth);

      this.startRenewalTimeout({
        leaseDurationSeconds: auth.lease_duration,
      });

    } catch(err) {
      const errMessage = 'Error renewing token in Vault App Role token manager';
      console.log(errMessage);
      if(!this.preventThrowingErrors) {
        throw new Error(errMessage);
      }
    }
  }
}

module.exports = {
  VaultAppRoleTokenManager,
};
