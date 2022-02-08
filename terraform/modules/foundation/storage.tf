resource "google_storage_bucket" "rair-files" {
  name          = "rair-files"
  location      = var.region
  force_destroy = true
  project       = var.gcp_project_id
  storage_class = "STANDARD"
}