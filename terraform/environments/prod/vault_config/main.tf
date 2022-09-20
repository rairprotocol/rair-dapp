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

locals {
  gke_nat_gateway_ip = "34.127.63.233"
}

module "vault_config" {
  source = "../../../modules/vault_config"

  rairnode_app_role_authorized_login_cidr_ranges = [
    "${local.gke_nat_gateway_ip}/32"
  ]
  blockchain_network_app_role_authorized_login_cidr_ranges = [
    "${local.gke_nat_gateway_ip}/32"
  ]
  media_service_app_role_authorized_login_cidr_ranges = [
    # "0.0.0.0/0"
  ]
}