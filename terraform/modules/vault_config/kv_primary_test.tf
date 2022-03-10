resource "vault_mount" "key_storage" {
  path        = "key_storage"
  type        = "kv-v2"
  description = "Key storage"
}