resource "google_storage_bucket" "rair-files" {
  name          = "${var.gcp_project_id}-rair-files"
  location      = var.region
  force_destroy = true
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}

resource "google_storage_bucket" "rair_images" {
  name          = "${var.gcp_project_id}-rair-images"
  location      = var.region
  force_destroy = true
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}

# Allow pulic users to view objects in images bucket
resource "google_storage_bucket_iam_binding" "rair_images_all_users_object_reader" {
  bucket = google_storage_bucket.rair_images.name
  role = "roles/storage.legacyObjectReader"
  members = [
    "allUsers",
  ]
}

# This bucket stores the TF State for manually managed, terraform data for Vault clusters
resource "google_storage_bucket" "vault_cluster_tf_admin" {
  name          = "${var.gcp_project_id}-vault-cluster-tf-state"
  location      = var.region
  storage_class = "STANDARD"
}

resource "google_storage_bucket" "kubernetes_tf_state_storage" {
  name          = "${var.gcp_project_id}-kubernetes-tf-state"
  location      = var.region
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}

resource "google_storage_bucket" "rair_files" {
  name          = "rair-files-${var.obfuscated_project_id}"
  location      = var.region
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}
