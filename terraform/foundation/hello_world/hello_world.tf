resource "google_storage_bucket" "hello_world" {
  name          = var.name
  force_destroy = true
  location = "US"

  uniform_bucket_level_access = true
}