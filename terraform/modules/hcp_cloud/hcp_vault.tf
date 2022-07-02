resource "hcp_vault_cluster" "primary" {
  cluster_id = "primary-${var.env_name}"
  hvn_id     = hcp_hvn.primary.hvn_id

  public_endpoint = true
  tier = var.vault_cluster_tier
}