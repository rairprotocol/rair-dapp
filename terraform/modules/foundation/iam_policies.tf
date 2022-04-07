resource "google_project_iam_binding" "rair_file_manager_binding" {
  project = var.gcp_project_id
  role    = "roles/storage.admin"
  members  = [
    "serviceAccount:${google_service_account.rair_file_manager.email}"
  ]
}

locals {
  jenkins_roles_to_bind = [
    "compute.instanceAdmin.v1",
    "iam.serviceAccountUser",
    "compute.networkAdmin",
    "compute.storageAdmin"
  ]
}

resource "google_project_iam_binding" "jenkins_gce" {
  count = length(local.jenkins_roles_to_bind)
  project = var.gcp_project_id
  role    = "roles/${local.jenkins_roles_to_bind[count.index]}"
  members  = [
    "serviceAccount:${google_service_account.jenkins_gce.email}"
  ]
}