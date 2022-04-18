# Garrett db admin user
resource "mongodbatlas_database_user" "db_admin_user_garrett" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_users.garrett.username

  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = module.mongo_shared.mongo_admin_db_name
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}

# Brian db admin user
resource "mongodbatlas_database_user" "admin_user_brian" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_users.brian.username
  
  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = module.mongo_shared.mongo_admin_db_name
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}

# Chris db admin user
resource "mongodbatlas_database_user" "db_admin_user_chris" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_users.chris.username
  
  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = module.mongo_shared.mongo_admin_db_name
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}

# Masha db admin user
resource "mongodbatlas_database_user" "db_admin_user_masha" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_users.masha.username
  
  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = module.mongo_shared.mongo_admin_db_name
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}

# Masha db admin user
resource "mongodbatlas_database_user" "db_admin_user_zeph" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_users.zeph.username
  
  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = module.mongo_shared.mongo_admin_db_name
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}