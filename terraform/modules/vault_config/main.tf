##########################################################
# Rair application config map
# Here we will store important information, metadata
# and configuration specs on each application that Vault
# will be expected to serve

# vault_secrets_dirname: Elsewhere in the Terraform we will
# create vault directories and policies with will
# allow each app role access to a specific KV secrets directory
##########################################################

variable "applications" {
  type = map(object({
    vault_secrets_dirname: string
  }))
  
  default = {
    rairnode: {
      vault_secrets_dirname: "rairnode"
    },
    blockchain-network: {
      vault_secrets_dirname: "blockchain-network"
    }
  }
}