const applicationConfig            = require('./shared_backend_code_generated/config/applicationConfig');
const { VaultAppRoleTokenManager } = require('./shared_backend_code_generated/vault/vaultAppRoleTokenManager');
const { AppSecretManager }         = require('./shared_backend_code_generated/vault/appSecretManager');

const appName = applicationConfig["blockchain-network"].name;

const vaultAppRoleTokenManager = new VaultAppRoleTokenManager({appName});
const appSecretManager = new AppSecretManager({appName})

module.exports = {
  vaultAppRoleTokenManager,
  appSecretManager
}