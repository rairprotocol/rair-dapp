resource "mongodbatlas_database_user" "rairnode" {
  auth_database_name = mongodbatlas_cluster.primary.name
  project_id   = module.mongo_shared.mongo_project_id_map.dev.project_id
}