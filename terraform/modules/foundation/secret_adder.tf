resource "google_project_iam_binding" "secret_adder" {
  project = var.gcp_project_id
  role    = "roles/secretmanager.secretVersionAdder"
  members = formatlist("user:%s", var.secret_adder_role_users)
}