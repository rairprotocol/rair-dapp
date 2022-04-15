resource "tfe_variable" "rair_staging_HCP_CLIENT_SECRET" {
  key = "HCP_CLIENT_SECRET"
  description = "HCP_CLIENT_SECRET"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}

resource "tfe_variable" "rair_staging_HCP_CLIENT_ID" {
  key = "HCP_CLIENT_ID"
  description = "HCP_CLIENT_ID"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}

resource "tfe_variable" "rair_staging_MONGODB_ATLAS_PRIVATE_KEY" {
  key = local.mongo_private_key_constant
  description = local.mongo_private_key_constant
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}

resource "tfe_variable" "rair_staging_MONGODB_ATLAS_PUBLIC_KEY" {
  key = local.mongo_public_key_constant
  description = local.mongo_public_key_constant
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.ENV
  sensitive = true
}

resource "tfe_variable" "rair_staging_gcp_tf_admin_service_account_json" {
  key = "gcp_tf_admin_service_account_json"
  description = "gcp_tf_admin_service_account_json"
  workspace_id = tfe_workspace.rair_staging.id
  category = var.tf_variable_types.TERRAFORM
  sensitive = true
}