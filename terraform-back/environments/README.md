# Rair TF Environments


## Environments directory list:
- Cloudflare
- Dev (Foundation)
- Pagerduty
- Prod (Foundation)
- Shared
  - Not an environment, but a location where we share common configs
- Staging (Foundation)


### How to add DB Admin users

Becasue TF creates users with an initial a default password, which is the same for each users, and stored in TF state after creation, when we first create users in Mongo Atlas, they need to at first be granted no access.

For example, we'll first create a user like this. Notice this user has not been granted any roles:
```
# Garrett db admin user
resource "mongodbatlas_database_user" "garrett_db_admin_user" {
  auth_database_name = module.mongo_shared.mongo_admin_db_name
  project_id   = local.project_id
  username = module.mongo_shared.db_admin_users.garrett.username
  password = module.mongo_shared.initial_db_user_password_before_manual_reset
  
  roles {
    # role_name = module.mongo_shared.built_in_roles_map.dbAdminAnyDatabase
  }
  
  # Scope db admin user to specific DB's
  # expand this list manually as we add databases
  scopes {
    name   = mongodbatlas_cluster.primary.name
    type = "CLUSTER"
  }
}
```

Then, after submitting this as Pull Request, landing and applying with TF cloud, we need to visit the Mongo Atlas dashboard, change the password to something more secure, and save that password into 1Password for the given user.

Then, we can submit a new PR which grants this user access by adding the role block back in, and removing the password argument completely.

See docs on this here:
https://registry.terraform.io/providers/mongodb/mongodbatlas/latest/docs/resources/database_user#password