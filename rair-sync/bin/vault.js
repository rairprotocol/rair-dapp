const applicationConfig            = require('./shared_backend_code_generated/config/applicationConfig');
const { VaultAppRoleTokenManager } = require('./shared_backend_code_generated/vault/vaultAppRoleTokenManager');
const { AppSecretManager }         = require('./shared_backend_code_generated/vault/appSecretManager');

const appName = applicationConfig["blockchain-network"].name;

const vaultAppRoleTokenManager = new VaultAppRoleTokenManager({
  appName,
  preventThrowingErrors: true
});

const appSecretManager = new AppSecretManager({
  appName,
  preventThrowingErrors: true
})

module.exports = {
  vaultAppRoleTokenManager,
  appSecretManager
}