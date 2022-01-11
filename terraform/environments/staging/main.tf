terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-staging"
    }
  }
}

variable "gcp_tf_admin_service_account_json" {
  type        = string
  description = "GCP tf-admin authentication file"
}

provider "google" {
  credentials = file(var.gcp_tf_admin_service_account_json)
  project     = "rair-market-staging"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "staging"
}