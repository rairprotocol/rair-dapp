terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "mongo-db-staging"
    }
  }
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "1.2.0"
    }
  }
}

locals {
  project_id = module.mongo_shared.mongo_project_id_map.staging.project_id
}

module "mongo_shared" {
  source = "../../shared/mongo"
}

# common resources used in all mongo projects
module "mongo_common" {
  source = "../../../modules/mongo"
  
  # replace this entry with a real db output variable later
  primary_db_name = "primary"
  
  project_id = local.project_id
}