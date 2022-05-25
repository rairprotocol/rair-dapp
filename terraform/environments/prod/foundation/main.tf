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

module "foundation" {
  source = "../../../modules/foundation"

  env_name = module.config.env_config.prod.env_name
  region = module.config.env_config.prod.region
  gcp_project_id = module.config.env_config.prod.gcp_project_id
  vpc_cidr_block = module.config.env_config.prod.vpc_cidr_block
  mongo_atlas_org_id = module.config.mongo_atlas_org_id
  jenkins_internal_load_balancer_name = module.config.jenkins_internal_load_balancer_name
  rair_internal_load_balancer_name = module.config.rair_internal_load_balancer_name
  account_users = [
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

output "complete_output" {
  value = module.foundation.complete_output
}