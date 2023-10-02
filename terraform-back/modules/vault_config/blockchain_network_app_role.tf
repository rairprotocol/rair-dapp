resource "vault_approle_auth_backend_role" "blockchain_network" {
  backend        = vault_auth_backend.primary.path
  role_name      = "blockchain-network"
  
  token_policies = [
    # allow access to read secrets for rairnode application
    vault_policy.app_directory_secret_read_access[var.applications.blockchain-network.vault_secrets_dirname].name
  ]
  
  bind_secret_id = true
  # (Optional)
  # Whether or not to require secret_id to be presented when logging in using this AppRole.
  # Defaults to true.

  secret_id_bound_cidrs = var.blockchain_network_app_role_authorized_login_cidr_ranges
  # (Optional) If set, specifies blocks of IP addresses which can perform the login operation.
  
  secret_id_num_uses = 0
  # (Optional) The number of times any particular SecretID can be used to fetch a token from this AppRole,
  # after which the SecretID will expire.
  # A value of zero will allow unlimited uses.
}