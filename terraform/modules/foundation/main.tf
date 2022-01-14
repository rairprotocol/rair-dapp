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
  name          = "bastion_test"
  machine_type = "g1-small"
  zone = "us-west1-a"
  # project = var.project
  tags = ["bastion"]
  
  // Specify the Operating System Family and version.

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }
  network_interface {
    network = "default"
  }
  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
  }
}
  data "google_compute_image" "bastion" {
  family  = "debian-9"
  project = "debian-cloud"
}

resource "google_compute_disk" "foobar" {
  name  = "existing-disk"
  image = data.google_compute_image.bastion.self_link
  size  = 10
  type  = "pd-ssd"
  zone  = "us-central1-a"
}

resource "google_compute_resource_policy" "daily_backup" {
  name   = "every-day-4am"
  region = "us-central1"
  snapshot_schedule_policy {
    schedule {
      daily_schedule {
        days_in_cycle = 1
        start_time    = "04:00"
      }
    }
  }
}