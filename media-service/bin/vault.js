const applicationConfig = require('./share_backend_code/config/applicationConfig');
const { VaultAppRoleTokenManager } = require('./share_backend_code/vault/vaultAppRoleTokenManager');
const { AppSecretManager } = require('./share_backend_code/vault/appSecretManager');
const { VaultKeyManager } = require('./share_backend_code/vault/vaultKeyManager');

const appName = applicationConfig['media-service'].name;

const vaultAppRoleTokenManager = new VaultAppRoleTokenManager({
  appName,
  preventThrowingErrors: true,
});
const appSecretManager = new AppSecretManager({
  appName,
  preventThrowingErrors: true,
});
const vaultKeyManager = new VaultKeyManager({
  preventThrowingErrors: true,
});

module.exports = {
  vaultAppRoleTokenManager,
  appSecretManager,
  vaultKeyManager,
};
