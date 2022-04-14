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
  mongo_atlas_variable_description_template = "Mongo DB Atlas %s generated from project id: %s"
}