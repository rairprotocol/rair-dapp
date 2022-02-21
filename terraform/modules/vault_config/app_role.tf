resource "vault_auth_backend" "primary" {
  type = "approle"
}

resource "vault_approle_auth_backend_role" "test_role" {
  backend        = vault_auth_backend.primary.path
  role_name      = "test-role"
  
  token_policies = [
    vault_policy.primary.name
  ]
  
  bind_secret_id = true
  # (Optional)
  # Whether or not to require secret_id to be presented when logging in using this AppRole.
  # Defaults to true.

  # TODO: tighten this up later
  secret_id_bound_cidrs = formatlist("%s/32", var.test_app_role_authorized_login_ips)
  # (Optional) If set, specifies blocks of IP addresses which can perform the login operation.
  
  secret_id_num_uses = 0
  # (Optional) The number of times any particular SecretID can be used to fetch a token from this AppRole, after which the SecretID will expire. A value of zero will allow unlimited uses.
}