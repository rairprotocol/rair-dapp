resource "google_secret_manager_secret" "vault_role_id" {
  secret_id = "gke-vault-role-id-${var.gke_workload_name}"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "vault_secret_id" {
  secret_id = "gke-vault-secret-id-${var.gke_workload_name}"
  replication {
    automatic = true
  }
}