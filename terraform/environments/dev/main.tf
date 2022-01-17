terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-dev"
    }
  }
}

variable "gcp_tf_admin_service_account_json" {
  type        = string
  description = "GCP tf-admin authentication file"
}

provider "google" {
  credentials = var.gcp_tf_admin_service_account_json
  project     = "rair-market-dev"
}

module "config" {
  source = "../shared/env_config"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "dev"
  region = "us-central-1"
  vpc_cidr_block = module.config.env_config.dev.vpc_cidr_block
}