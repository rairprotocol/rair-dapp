resource "google_storage_bucket" "hello_world" {
  name          = "${var.env_name}-hello-world-bucket"
  force_destroy = true
  location = "US"

  uniform_bucket_level_access = true
}

resource "google_compute_network" "vpc_network" {
  name          = "${var.env_name}terraform-network"
  }