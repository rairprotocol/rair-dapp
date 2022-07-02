terraform {
  backend "gcs" {
    bucket  = "rair-market-production-vault-cluster-tf-state"
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
  address = "https://primary-prod-public-vault-19edc454.66c70199.z1.hashicorp.cloud:8200"
  token = var.vault_token
}

module "vault_config" {
  source = "../../../modules/vault_config"

  rairnode_app_role_authorized_login_cidr_ranges = [
    # "0.0.0.0/0"
  ]
  blockchain_network_app_role_authorized_login_cidr_ranges = [
    # "0.0.0.0/0"
  ]
}