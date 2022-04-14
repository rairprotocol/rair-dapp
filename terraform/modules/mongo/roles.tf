resource "mongodbatlas_custom_db_role" "read_write_primary_db" {
  project_id   = var.project_id
  name = "read-write-primary-db"

  inheritedRoles {
    role_name = module.mongo_shared.built_in_roles.readWrite
    database_name = var.primary_db_name
  }
}