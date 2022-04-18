terraform {
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "1.2.0"
    }
  }
}

locals {
  mongo_admin_db_name = module.mongo_shared.mongo_admin_db_name
}

module "mongo_shared" {
  source = "../../environments/shared/mongo"
}