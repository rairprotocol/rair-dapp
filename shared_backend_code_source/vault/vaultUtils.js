const applicationConfig = require('../config/applicationConfig');

const getVaultNamespace = () => 'admin/';

const getVaultUrl = () => process.env.VAULT_URL;

const getAppRoleIDFromEnv = ({appName}) => {
  if(appName === applicationConfig["rairnode"].name) {
    return process.env.VAULT_RAIRNODE_APP_ROLE_ID;
  }
  if(appName === applicationConfig["blockchain-network"].name) {
    return process.env.VAULT_BLOCKCHAIN_NETWORK_APP_ROLE_ID;
  }
}

const getAppRoleSecretIDFromEnv = ({appName}) => {
  if(appName === applicationConfig["rairnode"].name) {
    return process.env.VAULT_RAIRNODE_APP_ROLE_SECRET_ID;
  }
  if(appName === applicationConfig["blockchain-network"].name) {
    return process.env.VAULT_BLOCKCHAIN_NETWORK_APP_ROLE_SECRET_ID;
  }
}

const getVaultAppSecretKVLocation = () => {
  return "app_secrets"
}

module.exports = {
  getVaultNamespace,
  getVaultUrl,
  getAppRoleIDFromEnv,
  getAppRoleSecretIDFromEnv,
  getVaultAppSecretKVLocation
}
