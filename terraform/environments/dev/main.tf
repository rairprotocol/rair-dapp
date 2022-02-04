terraform {
  backend "gcs" {
    bucket  = "foundation-terraform-rair-market-dev"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project     = "rair-market-dev"
}

module "config" {
  source = "../shared/env_config"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "dev"
  region = "us-west1"
  gcp_project_id = "rair-market-dev"
  vpc_cidr_block = module.config.env_config.dev.vpc_cidr_block
  mongo_atlas_org_id = module.config.mongo_atlas_org_id
}

output "vpc_cidr_range_output" {
  value = module.foundation.vpc_cidr_range_output
}