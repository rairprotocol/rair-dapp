locals {
  x509_auth_user_postfix = "-x509-auth-user"
}

resource "mongodbatlas_database_user" "rairnode" {
  auth_database_name = module.mongo_shared.mongo_external_db_name
  project_id   = var.project_id
  username = "${local.applications.rairnode.name}${local.x509_auth_user_postfix}"
  x509_type =  module.mongo_shared.X509Type.MANAGED

  roles {
    role_name = mongodbatlas_custom_db_role.read_write_primary_db.role_name
    database_name = local.mongo_admin_db_name
  }
  
  scopes {
    name   = var.primary_db_name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_database_user" "blockchain_network_509" {
  auth_database_name = module.mongo_shared.mongo_external_db_name
  project_id   = var.project_id
  username = "${local.applications["blockchain-network"].name}${local.x509_auth_user_postfix}"
  x509_type =  module.mongo_shared.X509Type.MANAGED

  roles {
    role_name = mongodbatlas_custom_db_role.read_write_primary_db.role_name
    database_name = local.mongo_admin_db_name
  }
  
  scopes {
    name   = var.primary_db_name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_database_user" "dev_team_db_users" {
  for_each = var.dev_team_db_admins

  auth_database_name = module.mongo_shared.mongo_external_db_name
  project_id = var.project_id
  username = each.value.username
  x509_type =  module.mongo_shared.X509Type.MANAGED

  roles {
    role_name = module.mongo_shared.built_in_roles_map.dbAdmin
    database_name = local.mongo_admin_db_name
  }
}