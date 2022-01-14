resource "google_storage_bucket" "hello_world" {
  name          = "${var.env_name}-hello-world-bucket"
  force_destroy = true
  location = "US"

  uniform_bucket_level_access = true
}

resource "google_compute_network" "vpc_network" {
  name          = "${var.env_name}terraform-network"
  }

resource "google_compute_instance" "bastion" {
  name = local.hostname
  machine_type = "g1-small"
  # zone = var.zone
  # project = var.project
  tags = ["bastion"]
  
  // Specify the Operating System Family and version.

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }