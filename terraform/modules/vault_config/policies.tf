resource "vault_policy" "primary" {
  name = "primary"

  policy = <<EOT
path "${vault_mount.primary.path}/data/${local.generic_secret_test_sub_path}" { 
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOT
}