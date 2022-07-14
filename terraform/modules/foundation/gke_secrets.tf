module "vault_role_id_secret_id_rairnode" {
  depends_on = [google_project_service.secret_manager]
  
  source = "../vault_role_id_secret_id"
  gke_workload_name = "rairnode"
  service_account_email_to_grant_secret_accessor = google_service_account.each_gke_service_account["rairnode"].email
}

module "vault_role_id_secret_id_blockchain_networks" {
  depends_on = [google_project_service.secret_manager]
  
  source = "../vault_role_id_secret_id"
  gke_workload_name = "blockchain-networks"
  service_account_email_to_grant_secret_accessor = google_service_account.each_gke_service_account["blockchain_networks"].email
}