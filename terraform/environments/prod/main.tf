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
  source = "../shared/env_config"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "prod"
  region = "us-west1"
  gcp_project_id = "rair-market-production"
  vpc_cidr_block = module.config.env_config.prod.vpc_cidr_block
  mongo_atlas_org_id = module.config.mongo_atlas_org_id
}

output "vpc_cidr_range_output" {
  value = module.foundation.vpc_cidr_range_output
}