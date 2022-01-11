terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-staging"
    }
  }
}

variable "gcp_auth_file" {
  type        = string
  description = "GCP authentication file"
}

provider "google" {
  credentials = file(var.gcp_auth_file)
  project     = "rair-market-staging"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "staging"
}