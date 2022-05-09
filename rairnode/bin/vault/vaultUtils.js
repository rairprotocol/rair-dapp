const getVaultNamespace = () => 'admin/';

const getVaultUrl = () => process.env.VAULT_URL;

const getAppRoleIDFromEnv = () => process.env.APP_ROLE_ID;

const getAppRoleSecretIDFromEnv = () => process.env.APP_ROLE_SECRET_ID;

module.exports = {
  getVaultNamespace,
  getVaultUrl,
  getAppRoleIDFromEnv,
  getAppRoleSecretIDFromEnv,
};
