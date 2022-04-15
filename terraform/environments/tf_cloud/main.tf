terraform {
  required_providers {
    tfe = {
      source = "hashicorp/tfe"
      version = "0.30.2"
    }
  }
}

provider "tfe" {}

module "mongo_shared" {
  source = "../../environments/shared/mongo"
}

locals {
  mongo_atlas_variable_description_template = "%s generated from Mongo Atlas project id: %s"
  mongo_private_key_constant = "MONGODB_ATLAS_PRIVATE_KEY"
  mongo_public_key_constant = "MONGODB_ATLAS_PUBLIC_KEY"
}