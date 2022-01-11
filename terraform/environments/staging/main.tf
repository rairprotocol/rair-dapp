terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-staging"
    }
  }
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "staging"
}