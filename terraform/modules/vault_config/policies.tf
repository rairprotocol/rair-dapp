resource "vault_policy" "primary" {
  name = "primary"

  policy = <<EOT
path "${vault_mount.primary.path}/data/${local.generic_secret_test_sub_path}" { 
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOT
}

resource "vault_policy" "key_storage_admin" {
  name = "key-storage-admin"

  policy = <<EOT
path "${vault_mount.key_storage.path}/data/*" { 
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOT
}