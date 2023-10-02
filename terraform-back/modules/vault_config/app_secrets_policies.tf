# Create read only access policy for each app specified in var.applications
resource "vault_policy" "app_directory_secret_read_access" {
  for_each = var.applications
  name = "${each.value.vault_secrets_dirname}-app-secrets-read-only"

  policy = <<EOT
path "${vault_mount.app_secrets.path}/data/${each.value.vault_secrets_dirname}/*" {
  capabilities = ["read"]
}
EOT
}