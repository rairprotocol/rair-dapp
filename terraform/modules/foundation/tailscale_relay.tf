locals {
  tailscale_relay_compute_image_family = "debian-9"
  tailscale_relay_compute_image_project = "debian-cloud"
  tailscale_relay_resource_namespace = "tailscale-relay"
}

data "google_compute_image" "tailscale_relay" {
  family  = local.tailscale_relay_compute_image_family
  project = local.tailscale_relay_compute_image_project
}

data "template_file" "tailscale_relay_starup_script" {
  template = file("${path.module}/tailscale_relay_startup_script.sh")
  vars = {
    tags = "private-subnet-relay"
    advertised_routes = ""
    tailscale_auth_key_secret_name = google_secret_manager_secret.tailscale_auth_key.name
  }
}

resource "google_compute_instance_template" "tailsacle_relay" {
  name        = local.tailscale_relay_resource_namespace
  description = "Tailscale relay instance template"

  instance_description = "Tailscale relay"
  machine_type         = "f1-micro"

  // Create a new boot disk from an image
  disk {
    source_image      = "${local.tailscale_relay_compute_image_project}/${local.tailscale_relay_compute_image_family}"
    auto_delete       = true
    boot              = true
  }

  network_interface {
    network = google_compute_network.primary.id
    subnetwork = google_compute_subnetwork.private.id
    stack_type = "IPV4_ONLY"
  }

  metadata_startup_script = data.template_file.tailscale_relay_starup_script.rendered
}

resource "google_compute_instance_group_manager" "tailscale_relay" {
  name = local.tailscale_relay_resource_namespace
  description = "Tailscale relay bastion instance group manager"

  base_instance_name = local.tailscale_relay_resource_namespace
  zone               = local.avaliablity_zones.a

  version {
    instance_template  = google_compute_instance_template.tailsacle_relay.id
  }

  target_size  = 1
}

# Used to store the tailscale auth key secret
resource "google_secret_manager_secret" "tailscale_auth_key" {
  depends_on = [google_project_service.secret_manager]
  secret_id = "tailscale-auth-key"

  replication {
    automatic = true
  }
}