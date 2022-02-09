resource "google_project_iam_binding" "rair-file-manager-binding" {
  project = var.gcp_project_id
  role    = "roles/storage.admin"
  members  = [
      "serviceAccount:rair-file-manager@rair-market-dev.iam.gserviceaccount.com"
  ]
}

resource "google_project_iam_binding" "jenkins-gce-1" {
  project = var.gcp_project_id
  role    = "roles/compute.instanceAdmin.v1"
  members  = [
      "serviceAccount:jenkins-gce@rair-market-dev.iam.gserviceaccount.com"
  ]
}

resource "google_project_iam_binding" "jenkins-gce-2" {
  project = var.gcp_project_id
  role    = "roles/iam.serviceAccountUser"
  members  = [
      "serviceAccount:jenkins-gce@rair-market-dev.iam.gserviceaccount.com"
  ]
}

resource "google_project_iam_binding" "jenkins-gce-3" {
  project = var.gcp_project_id
  role    = "roles/compute.networkAdmin"
  members  = [
      "serviceAccount:jenkins-gce@rair-market-dev.iam.gserviceaccount.com"
  ]
}