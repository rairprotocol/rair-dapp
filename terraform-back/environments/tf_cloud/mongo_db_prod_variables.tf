resource "tfe_variable" "PROD_MONGODB_ATLAS_PRIVATE_KEY" {
  key             = local.mongo_private_key_constant
  category        = var.tf_variable_types.ENV
  description     = format(
    local.mongo_atlas_variable_description_template,
    local.mongo_private_key_constant,
    module.mongo_shared.mongo_project_id_map.prod.project_id
  )
  workspace_id = tfe_workspace.mongo_db_prod.id
  sensitive = true
}

resource "tfe_variable" "PROD_MONGODB_ATLAS_PUBLIC_KEY" {
  key             = local.mongo_public_key_constant
  category        = var.tf_variable_types.ENV
  description     = format(
    local.mongo_atlas_variable_description_template,
    local.mongo_public_key_constant,
    module.mongo_shared.mongo_project_id_map.prod.project_id
  )
  workspace_id = tfe_workspace.mongo_db_prod.id
  sensitive = true
}