resource "mongodbatlas_custom_db_role" "read_write_primary_db" {
  project_id   = module.mongo_shared.mongo_project_id_map.dev.project_id
  name = "read-write-primary-db"

  inheritedRoles {
    role_name = module.mongo_shared.built_in_roles.readWrite
    database_name = mongodbatlas_cluster.primary.name
  }
}