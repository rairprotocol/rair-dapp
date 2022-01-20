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
  vpc_cidr_block = module.config.env_config.dev.vpc_cidr_block
}