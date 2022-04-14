resource "tfe_variable" "PROD_MONGODB_ATLAS_PRIVATE_KEY" {
  key             = "MONGODB_ATLAS_PRIVATE_KEY"
  category        = var.tf_variable_types.ENV
  description     = format(
    local.mongo_atlas_variable_description_template,
    "private key",
    module.mongo_shared.mongo_project_id_map.prod.project_id
  )
  workspace_id = tfe_workspace.mongo_db_prod.id
  sensitive = true
}

resource "tfe_variable" "PROD_MONGODB_ATLAS_PUBLIC_KEY" {
  key             = "MONGODB_ATLAS_PUBLIC_KEY"
  category        = var.tf_variable_types.ENV
  description     = format(
    local.mongo_atlas_variable_description_template,
    "public key",
    module.mongo_shared.mongo_project_id_map.prod.project_id
  )
  workspace_id = tfe_workspace.mongo_db_prod.id
  sensitive = true
}

# terraform import tfe_variable.PROD_MONGODB_ATLAS_PRIVATE_KEY rairtech/mongo-db-prod/var-xdzu6v46CbDRMQqA
# terraform import tfe_variable.PROD_MONGODB_ATLAS_PUBLIC_KEY rairtech/mongo-db-prod/var-c3EFqGquUoc9FwPz