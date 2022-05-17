const applicationConfig            = require('./shared_backend_code_generated/config/applicationConfig');
const { VaultAppRoleTokenManager } = require('./shared_backend_code_generated/vault/vaultAppRoleTokenManager');
const { AppSecretManager }         = require('./shared_backend_code_generated/vault/appSecretManager');
const { VaultKeyManager }          = require('./shared_backend_code_generated/vault/vaultKeyManager');

const appName = applicationConfig.rairnode.name;

const vaultAppRoleTokenManager = new VaultAppRoleTokenManager({appName});
const appSecretManager = new AppSecretManager({appName})
const vaultKeyManager = new VaultKeyManager();

module.exports = {
  vaultAppRoleTokenManager,
  appSecretManager,
  vaultKeyManager
}