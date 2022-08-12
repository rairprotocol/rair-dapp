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



# Mongo DB Credential
module "mongodb_credential" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "MONGO_URI"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
    google_service_account.each_gke_service_account["blockchain_networks"].email
  ]
}

module "pinata_secret" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "PINATA_SECRET"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
    google_service_account.each_gke_service_account["blockchain_networks"].email
  ]
}

module "moralis_master_key_main" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "MORALIS_MASTER_KEY_MAIN"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
    google_service_account.each_gke_service_account["blockchain_networks"].email
  ]
}

module "moralis_master_key_test" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "MOARLIS_MASTER_KEY_TEST"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
    google_service_account.each_gke_service_account["blockchain_networks"].email
  ]
}

module "rair_file_manager" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "RAIR_FILE_MANAGER"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
  ]
}

module "jwt_secret" {
  depends_on = [google_project_service.secret_manager]

  source = "../gke_secret"

  secret_name = "JWT_SECRET"
  service_account_emails_to_grant_secret_accessor = [
    google_service_account.each_gke_service_account["rairnode"].email,
  ]
}