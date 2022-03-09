terraform {
  backend "gcs" {
    bucket  = "rair-market-dev-vault-cluster-tf-state"
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
  address = "https://primary-dev.vault.9871e6c3-b0b9-479a-b392-eb69322d192a.aws.hashicorp.cloud:8200"
  token = var.vault_token
}

module "vault_config" {
  source = "../../../modules/vault_config"

  test_app_role_authorized_login_ips = [
    # gke nat gateway
    "34.145.59.65",

    # Carquinez house, March 9th, 2022
    "99.47.22.182",
  ]
}

