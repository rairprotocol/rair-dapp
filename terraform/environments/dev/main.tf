terraform {
  backend "gcs" {
    bucket  = "foundation-terraform-rair-market-dev"
    prefix  = "terraform/state"
  }
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "dev"
}