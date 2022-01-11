terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "rair-production"
    }
  }
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "prod"
}