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
# add this range to the advertised subnets in relay
# kubernetes_control_plane_range

resource "google_compute_instance_template" "tailsacle_relay" {
  name_prefix = "${local.tailscale_relay_resource_namespace}-"
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

  service_account {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    email  = google_service_account.tailscale_relay.email
    scopes = ["cloud-platform"]
  }

  metadata_startup_script = data.template_file.tailscale_relay_starup_script.rendered
  
  # Instance Templates cannot be updated after creation with the Google Cloud Platform API.
  # In order to update an Instance Template, Terraform will destroy the existing resource and create a replacement.
  # In order to effectively use an Instance Template resource with an Instance Group Manager resource, it’s recommended to specify create_before_destroy in a lifecycle block.
  # Either omit the Instance Template name attribute, or specify a partial name with name_prefix.
  lifecycle {
    create_before_destroy = true
  }
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

################################################
# IAM for tailscale relay machine
# TODO: add the user for relay node here
# it will need to access this secret
data "google_iam_policy" "tailscale_secret_accessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      # TODO: take brian user account out after it's working
      "user:${local.users.brian_fogg.email}",
      "serviceAccount:${google_service_account.tailscale_relay.email}"
    ]
  }
}

resource "google_secret_manager_secret_iam_policy" "tailscale_secret_accessor" {
  secret_id = google_secret_manager_secret.tailscale_auth_key.secret_id
  policy_data = data.google_iam_policy.tailscale_secret_accessor.policy_data
}