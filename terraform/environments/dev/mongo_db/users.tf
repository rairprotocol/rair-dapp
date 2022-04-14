resource "mongodbatlas_database_user" "rairnode" {
  auth_database_name = mongodbatlas_cluster.primary.name
  project_id   = module.mongo_shared.mongo_project_id_map.dev.project_id

  roles {
    role_name = mongodbatlas_custom_db_role.read_write_primary_db.name
  }
}