const applicationConfig            = require('./shared_backend_code_generated/config/applicationConfig');
const { VaultAppRoleTokenManager } = require('./shared_backend_code_generated/vault/vaultAppRoleTokenManager');
const { AppSecretManager }         = require('./shared_backend_code_generated/vault/appSecretManager');
const { VaultKeyManager }          = require('./shared_backend_code_generated/vault/vaultKeyManager');

const appName = applicationConfig.rairnode.name;

const vaultAppRoleTokenManager = new VaultAppRoleTokenManager({
  appName,
  preventThrowingErrors: true
});
const appSecretManager = new AppSecretManager({
  appName,
  preventThrowingErrors: true
})
const vaultKeyManager = new VaultKeyManager({
  preventThrowingErrors: true
});

module.exports = {
  vaultAppRoleTokenManager,
  appSecretManager,
  vaultKeyManager
}