terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-production"
    }
  }
}

variable "gcp_tf_admin_service_account_json" {
  type        = string
  description = "GCP tf-admin authentication file"
}

provider "google" {
  credentials = var.gcp_tf_admin_service_account_json
  project     = "rair-market-production"
}

module "config" {
  source = "../../shared/env_config"
}

locals {
  prod_env_config = module.config.env_config.prod

  gcp_project_id                = local.prod_env_config.gcp_project_id
  env_name                      = local.prod_env_config.env_name
  region                        = local.prod_env_config.region
  vpc_cidr_block                = local.prod_env_config.vpc_cidr_block
  obfuscated_project_id         = local.prod_env_config.obfuscated_project_id
  minting_marketplace_subdomain = local.prod_env_config.minting_marketplace_frontend_subdomain
  rairnode_subdomain            = local.prod_env_config.rairnode_subdomain
}

module "foundation" {
  source = "../../../modules/foundation"

  env_name                              = local.env_name
  region                                = local.region
  gcp_project_id                        = local.gcp_project_id
  vpc_cidr_block                        = local.vpc_cidr_block
  mongo_atlas_org_id                    = module.config.mongo_atlas_org_id
  obfuscated_project_id                 = local.obfuscated_project_id
  minting_marketplace_subdomain         = local.minting_marketplace_subdomain
  rairnode_subdomain                    = local.rairnode_subdomain
  account_users                         = [
    {
      email: module.config.users.brian.email,
      role: "roles/editor"
    },
    {
      email: module.config.users.zeph.email,
      role: "roles/editor"
    },
    {
      email: module.config.users.ramki.email,
      role: "roles/viewer"
    }
  ]
  secret_adder_role_users = [
    module.config.users.brian.email,
    module.config.users.zeph.email
  ]
}

module "hcp_cloud" {
  source = "../../../modules/hcp_cloud"
  env_name = module.config.env_config.prod.env_name
  vault_cluster_tier = "starter_small"
}

output "complete_output" {
  value = module.foundation.complete_output
}