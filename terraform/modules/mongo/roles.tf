resource "mongodbatlas_custom_db_role" "read_write_primary_db" {
  project_id   = var.project_id
  role_name = "read-write-primary-db"

  inherited_roles {
    role_name = module.mongo_shared.built_in_roles_map.readWrite
    database_name = var.primary_db_name
  }
}

resource "mongodbatlas_custom_db_role" "lowest_data_access_possible" {
  project_id   = var.project_id
  role_name = "least-possible-data-access-initial-tf-role"

  inherited_roles {
    role_name = module.mongo_shared.built_in_roles_map.clusterMonitor
    database_name = local.mongo_admin_db_name
  }
}
