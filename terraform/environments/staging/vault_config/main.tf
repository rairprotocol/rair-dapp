terraform {
  backend "gcs" {
    bucket  = "rair-market-staging-vault-cluster-tf-state"
    prefix  = "terraform/state"
  }
}

terraform {
  required_providers {
    vault = {
      source = "hashicorp/vault"
      version = "3.2.1"
    }
  }
}

variable "vault_token" {
  type = string
}

provider "vault" {
  address = "??? TBD ???"
  token = var.vault_token
}

module "vault_config" {
  source = "../../../modules/vault_config"
}

