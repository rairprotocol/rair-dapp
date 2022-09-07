# Bucket admin for images bucket
resource "google_storage_bucket_iam_binding" "image_manager_gke_binding" {
  bucket = google_storage_bucket.rair_images.name
  role = "roles/storage.admin"
  members = [
    # Rairnode
    "serviceAccount:${google_service_account.each_gke_service_account[
      "rairnode"
    ].email}"
  ]
}

# Bucket admin for rair-files bucket
resource "google_storage_bucket_iam_binding" "file_manager_gke_binding" {
  bucket = google_storage_bucket.rair-files.name
  role = "roles/storage.admin"
  members = [
    # Rairnode
    "serviceAccount:${google_service_account.each_gke_service_account[
      "rairnode"
    ].email}",

    # Media service
    "serviceAccount:${google_service_account.each_gke_service_account[
      "media_service"
    ].email}",
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