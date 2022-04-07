# In this file we are defining a complete list of all secrets
# used by terraform in each namespace

# Because we are creating these secrets manually,
# but we need to reference their names throughout the TF code
# we need a source of truth for all secret names/metadata
# without importing secret data resources
# as that will allow secret data to leak into the TF state

# this file will be maintained and kept up to date with various secrets
# created by the kubernetes admin team

# eventually we will move to Vault hosted secrets
# and this won't be neccesary

variable "namespaces" {
  type = map(object({
    namespace = string,
    secrets = map(object({
      name: string
    }))
  }))

  default = {
    default: {
      namespace: "defaut",
      secrets: {
        "cd-jenkins": {
          name: "cd-jenkins",
        }
        "jwt-secret": {
          name: "jwt-secret"
        }
      }
    },
    ukraine: {
      namespace: "ukraine",
      secrets: {
        "pinata-secret": {
          name: "pinata-secret",
        }
      }
    }
  }
}