terraform {
  backend "gcs" {
    bucket  = "foundation-terraform-rair-market-dev"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project     = "rair-market-dev"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "dev"
}