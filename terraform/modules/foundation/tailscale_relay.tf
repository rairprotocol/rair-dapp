locals {
  tailscale_relay_compute_image_family = "debian-9"
  tailscale_relay_compute_image_project = "debian-cloud"
  tailscale_relay_resource_namespace = "tailscale-relay"
}

data "google_compute_image" "tailscale_relay" {
  family  = local.tailscale_relay_compute_image_family
  project = local.tailscale_relay_compute_image_project
}

resource "google_compute_instance_template" "tailsacle_relay" {
  name_prefix = "${local.tailscale_relay_resource_namespace}-"
  description = "Tailscale relay instance template"

  instance_description = "Tailscale relay"
  machine_type         = "f1-micro"

  tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  // Create a new boot disk from an image
  disk {
    source_image      = "${local.tailscale_relay_compute_image_project}/${local.tailscale_relay_compute_image_family}"
    auto_delete       = true
    boot              = true
  }

  network_interface {
    network = google_compute_network.primary.id
    subnetwork = google_compute_subnetwork.vpn.id
    stack_type = "IPV4_ONLY"


    # Comment this back in to get a public address on the dev Tailscale machine
    # We need this if we want to SSH into the machine for testing
    # access_config {}
  }

  service_account {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    email  = google_service_account.tailscale_relay.email
    scopes = ["cloud-platform"]
  }

  metadata_startup_script = templatefile("${path.module}/tailscale_relay_startup_script.sh", {
    tags = "tag:private-subnet-relay-${var.env_name}"

    # List of routes/cidr ranges that Tailscale advertises
    # and automatically proxies traffic through from developer machines
    advertised_routes = join(",", [
      # access entire VPC CIDR range
      var.vpc_cidr_block,
      # Access peered Mongo DB CIDR Range
      module.vpc_cidr_ranges.network_cidr_blocks.mongo_primary_cluster_range
    ])
    tailscale_auth_key_secret_name = local.tailscale_relay_secret_id
    hostname = "tailscale-relay-${var.env_name}"
  })
  
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

locals {
  tailscale_relay_secret_id = "tailscale-auth-key"
}

# Used to store the tailscale auth key secret
resource "google_secret_manager_secret" "tailscale_auth_key" {
  depends_on = [google_project_service.secret_manager]
  secret_id = local.tailscale_relay_secret_id

  replication {
    automatic = true
  }
}

################################################
# IAM for tailscale relay machine
data "google_iam_policy" "tailscale_secret_accessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      "serviceAccount:${google_service_account.tailscale_relay.email}"
    ]
  }
}

resource "google_secret_manager_secret_iam_policy" "tailscale_secret_accessor" {
  secret_id = google_secret_manager_secret.tailscale_auth_key.secret_id
  policy_data = data.google_iam_policy.tailscale_secret_accessor.policy_data
}

resource "google_compute_router" "public_router" {
  name    = "public-router"
  region  = var.region
  network = google_compute_network.primary.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "public-router-nat"
  router                             = google_compute_router.public_router.name
  region                             = google_compute_router.public_router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"

  subnetwork {
    name = google_compute_subnetwork.vpn.name
    source_ip_ranges_to_nat = ["PRIMARY_IP_RANGE"]
  }
}