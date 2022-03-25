resource "vault_policy" "key_storage_admin" {
  name = "key-storage-admin"

  policy = <<EOT
path "${vault_mount.key_storage.path}/data/*" { 
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOT
}