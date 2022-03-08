class VaultAppRoleIntegration {
  constructor() {
    this.token = null;
    this.tokenRenewalTimer = null;
    this.tokenRenewalTimerInterval = null;

    // fire the initial call to get token
    // when class is fisrt instantiated
    this.getTokenWithAppRoleCreds();
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

  async getTokenWithAppRoleCreds() {
    try {
      // pull app role ROLE ID environment
      const appRoleID = this.getAppRoleIDFromEnv();

      // pull app role SECRET ID from environment
      const appRoleSecretID = this.getAppRoleSecretIDFromEnv()

      // Pull vault URL from environment
      const vaultURL = this.getVaultURL();

      // make login query to Vault
      const res = await axios.post({
        url: `${vaultURL}/v1/auth/approle/login`,
        data: {
          role_id: appRoleID,
          secret_id: appRoleSecretID
        }
      });

      console.log('res', res);

      // pull from API response
      const token = "???"

      // save token in this class
      this.saveToken(token)

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

  renewToken() {
    // make call to get new token using existing token
    if(this.token === null) throw new Error('Existing token is null!');

  } 

}

// instantiate one class and export it
// we only want one instance of this in the app
export const vaultAppRoleIntegration = new VaultAppRoleIntegration()