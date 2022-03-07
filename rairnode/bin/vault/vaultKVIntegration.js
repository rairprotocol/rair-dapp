class VaultKVIntegration {
  constructor() {
    this.token = null;
    this.tokenRenewalTimer = null;
    this.tokenRenewalTimerInterval = null;

    // fire the initial call to get token
    // when class is fisrt instantiated
    this.getTokenWithAppRoleCreds();
  }

  getAppRoleIDFromEnv() {
    // pull from process ENV?
    return "???";
  }

  getAppRoleSecretIDFromEnv() {
    // pull from process ENV?
    return "???";
  }

  getVaultURL() {
    // pull from process ENV?
    return "????";
  }

  getTokenWithAppRoleCreds() {
    // pull app role ROLE ID environment
    const appRoleID = this.getAppRoleIDFromEnv();

    // pull app role SECRET ID from environment
    const appRoleSecretID = this.getAppRoleSecretIDFromEnv()

    // Pull vault URL from environment
    const vaultURL = this.getVaultURL();

    // make login query to Vault

    // official docs
    // https://www.vaultproject.io/api-docs/auth/approle#login-with-approle

    // CLI example    
    // vault write "auth/approle/login" \
    // role_id=$ROLE_ID \
    // secret_id=$SECRET_ID

    // curl example
    // $ curl \
    // --request POST \
    // --data @payload.json \
    // http://127.0.0.1:8200/v1/auth/approle/login

    // pull from API response
    const token = "???"

    // save token in this class
    this.saveToken(token)
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