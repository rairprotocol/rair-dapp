resource "mongodbatlas_custom_db_role" "read_write_all_collections" {
  project_id   = module.mongo_shared.mongo_project_id_map.dev.project_id
  name = "read-write-primary-db"

  actions {
    action = "FIND"
    resources {
      database_name   = mongodbatlas_cluster.primary.name
    }
  }
  actions {
    action = "INSERT"
    resources {
      database_name   = mongodbatlas_cluster.primary.name
    }
  }
  actions {
    action = "REMOVE"
    resources {
      database_name   = mongodbatlas_cluster.primary.name
    }
  }
  actions {
    action = "UPDATE"
    resources {
      database_name   = mongodbatlas_cluster.primary.name
    }
  }
}