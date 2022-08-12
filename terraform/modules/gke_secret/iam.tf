data "google_iam_policy" "secret_accessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = formatlist("serviceAccount:%s", var.service_account_emails_to_grant_secret_accessor)
  }
}

resource "google_secret_manager_secret_iam_policy" "secret" {
  secret_id = google_secret_manager_secret.secret.secret_id
  policy_data = data.google_iam_policy.secret_accessor.policy_data
}