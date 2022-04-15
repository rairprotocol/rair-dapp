resource "mongodbatlas_database_user" "rairnode" {
  auth_database_name = var.primary_db_name
  project_id   = var.project_id
  username = "rairnode"
  password = "change_me_in_dashboard_after_TF_apply"
  
  roles {
    role_name = mongodbatlas_custom_db_role.read_write_primary_db.role_name
  }
}