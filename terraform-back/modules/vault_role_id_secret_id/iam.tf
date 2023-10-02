data "google_iam_policy" "secret_accessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      "serviceAccount:${var.service_account_email_to_grant_secret_accessor}"
    ]
  }
}

resource "google_secret_manager_secret_iam_policy" "vault_role_id" {
  secret_id = google_secret_manager_secret.vault_role_id.secret_id
  policy_data = data.google_iam_policy.secret_accessor.policy_data
}

resource "google_secret_manager_secret_iam_policy" "vault_secret_id" {
  secret_id = google_secret_manager_secret.vault_secret_id.secret_id
  policy_data = data.google_iam_policy.secret_accessor.policy_data
}