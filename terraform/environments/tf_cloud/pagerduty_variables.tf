resource "tfe_variable" "pagerduty_api_key" {
  key             = "pagerduty_api_key"
  category        = var.tf_variable_types.TERRAFORM
  description     = "Pagerduty API key"
  workspace_id = tfe_workspace.pagerduty.id
  sensitive = true
}

# terraform import tfe_variable.pagerduty_api_key rairtech/pagerduty/var-LqrHsYjVUE1KrjsX