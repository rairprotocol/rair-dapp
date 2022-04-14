resource "mongodbatlas_custom_db_role" "read_write_primary_db" {
  project_id   = var.project_id
  role_name = "read-write-primary-db"

  inherited_roles {
    role_name = module.mongo_shared.built_in_roles_map.readWrite
    database_name = var.primary_db_name
  }
}