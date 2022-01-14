resource "google_storage_bucket" "hello_world" {
  name          = "${var.env_name}-hello-world-bucket"
  force_destroy = true
  location = "US"

  uniform_bucket_level_access = true
}

resource "google_compute_network" "vpc_network" {
  name          = "${var.env_name}terraform-network"
  }

data "google_compute_image" "tailscale_base_image" {

  family  = "debian-9"

  project = "debian-cloud"

}

data "template_file" "tailscale_install_startup_script" {

  template = "${file("${path.module}/tailscale_startup_script.sh")}"

  vars = {

    advertised_routes: "${local.test_1_private_ip_cidr_range}"

  }

}

resource "google_compute_instance" "tailscale_bastion" {

  name         = "${var.env_name}-tailscale-bastion"

  machine_type = "f1-micro"

  boot_disk {

    initialize_params {

      image = data.google_compute_image.tailscale_base_image.self_link

    }

  }

  network_interface {

    network = google_compute_network.test_vpc.id

    subnetwork = google_compute_subnetwork.test_vpc_private.network

    access_config {

      // Ephemeral public IP

    }

  }

}