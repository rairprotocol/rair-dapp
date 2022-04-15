

resource "tfe_variable" "rair_staging_HCP_CLIENT_SECRET" {
  key = "HCP_CLIENT_SECRET"
  description = "HCP_CLIENT_SECRET"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}
# terraform import tfe_variable.rair_staging_HCP_CLIENT_SECRET rairtech/rair-staging/var-4qrnir1TYiUGnSGu


resource "tfe_variable" "rair_staging_HCP_CLIENT_ID" {
  key = "HCP_CLIENT_ID"
  description = "HCP_CLIENT_ID"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}
# terraform import tfe_variable.rair_staging_HCP_CLIENT_ID rairtech/rair-staging/var-Yu7D5kSNXP8321nh


resource "tfe_variable" "rair_staging_MONGODB_ATLAS_PRIVATE_KEY" {
  key = "MONGODB_ATLAS_PRIVATE_KEY"
  description = "MONGODB_ATLAS_PRIVATE_KEY"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}
# terraform import tfe_variable.rair_staging_MONGODB_ATLAS_PRIVATE_KEY rairtech/rair-staging/var-AwBrvDDZ3Dkxuvza


resource "tfe_variable" "rair_staging_MONGODB_ATLAS_PUBLIC_KEY" {
  key = "MONGODB_ATLAS_PUBLIC_KEY"
  description = "MONGODB_ATLAS_PUBLIC_KEY"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}
# terraform import tfe_variable.rair_staging_MONGODB_ATLAS_PUBLIC_KEY rairtech/rair-staging/var-XAERhWeM4awLBDCk


resource "tfe_variable" "rair_staging_gcp_tf_admin_service_account_json" {
  key = "gcp_tf_admin_service_account_json"
  description = "gcp_tf_admin_service_account_json"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.TERRAFORM
  sensitive = true
}
# terraform import tfe_variable.rair_staging_gcp_tf_admin_service_account_json rairtech/rair-staging/var-J1PM9ocW8tZthvDF