resource "mongodbatlas_database_user" "rairnode" {
  auth_database_name = local.mongo_admin_db_name
  project_id   = var.project_id
  username = "rairnode"
  
  roles {
    role_name = mongodbatlas_custom_db_role.read_write_primary_db.role_name
    database_name = local.mongo_admin_db_name
  }
  
  scopes {
    name   = var.primary_db_name
    type = "CLUSTER"
  }
}