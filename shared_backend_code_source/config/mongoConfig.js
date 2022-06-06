const mongoConfig = {
  GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL: process.env.GENERATE_MONGO_URI_WITH_VAULT_CREDENTIAL_UTIL,
  USE_X509_CERT_AUTH: process.env.USE_X509_CERT_AUTH,
  PRODUCTION: process.env.PRODUCTION,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_URI_LOCAL: process.env.MONGO_URI_LOCAL,
  MONGO_DB_HOSTNAME: process.env.MONGO_DB_HOSTNAME,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  VAULT_MONGO_USER_PASS_SECRET_KEY: "mongo-primary-password-creds",
  VAULT_MONGO_x509_SECRET_KEY: "mongo-primary-cert-creds"
}

module.exports = mongoConfig;