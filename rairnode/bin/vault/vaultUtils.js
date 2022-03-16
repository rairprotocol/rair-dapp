const getVaultNamespace = () => {
  return 'admin/'
}

const getVaultUrl = () => {
  return process.env.VAULT_URL
}

const getAppRoleIDFromEnv = () => {
  return process.env.APP_ROLE_ID
}

const getAppRoleSecretIDFromEnv = () => {
  return process.env.APP_ROLE_SECRET_ID
}

module.exports = {
  getVaultNamespace,
  getVaultUrl,
  getAppRoleIDFromEnv,
  getAppRoleSecretIDFromEnv 
}