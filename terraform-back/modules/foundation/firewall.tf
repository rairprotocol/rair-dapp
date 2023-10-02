# Don't worry, this is only enabled in the dev environment
# we need an easy way to get SSH access on the Tailscale bastion
# from time to time

# instructions on how to get this list of addresses from Google here
# https://thedataguy.in/how-gcp-browser-bases-ssh-works/
locals {
  google_browswer_ssh_access_cidr_ranges = [
    "35.190.247.0/24",
    "64.233.160.0/19",
    "66.102.0.0/20",
    "66.249.80.0/20",
    "72.14.192.0/18",
    "74.125.0.0/16",
    "108.177.8.0/21",
    "173.194.0.0/16",
    "209.85.128.0/17",
    "216.58.192.0/19",
    "216.239.32.0/19"
  ]
  enable_browser_tailscale_ssh_access = var.env_name == module.shared_config.env_config.dev.env_name
}

resource "google_compute_firewall" "tailscale_relay_ssh_ingress" {
  count = local.enable_browser_tailscale_ssh_access ? 1 : 0
  name        = "tailscale-relay-ssh-ingress"
  network = google_compute_network.primary.id
  description = "tailscale-relay-ssh-ingress"
  
  disabled = local.enable_browser_tailscale_ssh_access ? false : true

  allow {
    protocol  = "tcp"
    ports = [22]
  }

  direction = "INGRESS"

  target_tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  # This will allow SSH port 22 access in form specific addresses
  source_ranges = concat(
    local.users.brian_fogg.allowed_IPs_v4,
    local.google_browswer_ssh_access_cidr_ranges
  )
}


# Allow traffic from VPN subnet ingress into GKE cluster
# targeting by tag assigned to node pool

resource "google_compute_firewall" "tailscale_relay_ingress_to_gke" {
  name        = "tailscale-relay-gke-ingress"
  network = google_compute_network.primary.id
  description = "tailscale-relay-gke-ingress"

  allow {
    # allow all protocols and ports
    protocol  = "all"
  }

  direction = "INGRESS"

  target_tags = [
    local.public_node_pool_network_tag
  ]

  source_tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  source_ranges = [
    module.vpc_cidr_ranges.network_cidr_blocks.vpn
  ]
}

resource "google_compute_firewall" "primary_cluster_ingress_to_network" {
  name          = "primary-cluster-ingress-to-network"
  network       = google_compute_network.primary.id
  description   = "Allow primary GKE cluster traffic into rest of network. Allows peering to Mongo to work"

  allow {
    # allow all protocols and ports
    protocol    = "all"
  }

  direction     = "INGRESS"

  source_ranges = [
    module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_primary_cluster
  ]
}