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
  address = "https://primary-staging-public-vault-f709a5a3.9b077395.z1.hashicorp.cloud:8200"
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
  media_service_app_role_authorized_login_cidr_ranges = [
    # "0.0.0.0/0"
  ]
}

