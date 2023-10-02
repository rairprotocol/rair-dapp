# In this file we are defining a complete list of all secrets
# used by kubernetes in each of it's namespaces

# Because we are creating these secrets manually,
# but we need to reference their names throughout the TF code
# we need a source of truth for all secret names and metadata
# without importing secret data resources
# as that will allow secrets to leak into the TF state

# this file will be maintained and kept up to date with various secrets
# created by the kubernetes admin team

# eventually we will move to Vault hosted secrets
# and this won't be neccesary

variable "namespace_secrets" {
  type = map(object({
    # kubernetes namespace
    namespace = string,
    # env_secrets: secrets specifically used for env variables
    # in kubernetes services/deploymemts
    env_secrets = map(object({
      secret_name: string,
      env_reference_name: string
    }))
  }))

  # this double default is very confusing...
  # deafault: the terraform default value for this variable
  default = {
    # default: the kubernetes namespace!
    default: {
      namespace: "default",
      env_secrets: {
        "mongodb-credential": {
          secret_name: "mongodb-credential",
          env_reference_name: "MONGO_URI"
        },
        "mongodb-credential-local": {
          secret_name: "mongodb-credential",
          env_reference_name: "MONGO_URI_LOCAL"
        },
        "rair-manager-key": {
          secret_name: "rair-manager-key",
          env_reference_name: "GCP_CREDENTIALS"
        },
        "pinata-secret": {
          secret_name: "pinata-secret",
          env_reference_name: "PINATA_SECRET"
        },
        "jwt-secret": {
          secret_name: "jwt-secret",
          env_reference_name: "JWT_SECRET"
        },
        "moralis-master-key-test": {
          secret_name: "moralis-master-key-test",
          env_reference_name: "MORALIS_MASTER_KEY_TEST"
        },
        "moralis-master-key-main": {
          secret_name: "moralis-master-key-main",
          env_reference_name: "MORALIS_MASTER_KEY_MAIN"
        }
        "rair-file-manager": {
          secret_name: "rair-manager-key",
          env_reference_name: "key.json"
        }
      }
    }
  }
}