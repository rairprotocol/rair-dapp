resource "vault_mount" "app_secrets" {
  path        = "app_secrets"
  type        = "kv-v2"
  description = "App Specific Secrets"
}

# Generate directories with Terraform by creating a placeholder secret
# this will generate the correct directory structure so that future devs
# don't have to guess where things go when they log into Vault for the first time
resource "vault_generic_secret" "secret_directory_placeholders" {
  for_each = var.applications
  path = "${vault_mount.app_secrets.path}/${each.value.vault_secrets_dirname}/directory_placeholder_secret_TF_managed_DO_NOT_MODIFY"
  data_json = <<EOT
{
  "placeholder_secret_TF_managed": "placeholder"
}
EOT
}