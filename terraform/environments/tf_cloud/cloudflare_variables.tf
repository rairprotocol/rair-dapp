resource "tfe_variable" "CLOUDFLARE_API_TOKEN" {
  key             = "CLOUDFLARE_API_TOKEN"
  category        = var.tf_variable_types.ENV
  description     = "Cloudflare API token"
  workspace_id = tfe_workspace.cloudflare.id
  sensitive = true
}
