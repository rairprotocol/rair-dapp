resource "google_compute_network" "primary" {
  name = "primary"
  description = "Primary VPC network for Rair env: ${var.env_name}"
  auto_create_subnetworks = false
  routing_mode = "REGIONAL"
  delete_default_routes_on_create = true
}

module "vpc_cidr_ranges" {
  source = "hashicorp/subnets/cidr"

  base_cidr_block = var.vpc_cidr_block
  networks = [
    {
      name     = "vpn"
      new_bits = 10
    },
    {
      name = "kubernetes_primary_cluster",
      new_bits = 4
    },
    {
      name = "kubernetes_pod_cluster_secondary_range",
      new_bits = 6
    },
    {
      name = "kubernetes_services_secondary_range",
      new_bits = 6
    },
    {
      name = "kubernetes_control_plane_range",
      new_bits = 14
    },
    {
      name = "mongo_primary_cluster_range",
      new_bits = 4
    }
  ]
}

locals {
  kubernetes_primary_cluster_services_secondary_range_name = "gke-${local.kubenetes_primary_cluster_name}-services"
  kubernetes_primary_cluster_pod_cluster_secondary_range_name = "gke-${local.kubenetes_primary_cluster_name}-pods"
}

resource "google_compute_subnetwork" "kubernetes_primary_cluster" {
  name = "kubernetes-primary-cluster"

  region  = var.region
  network = google_compute_network.primary.self_link

  private_ip_google_access = true
  ip_cidr_range = module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_primary_cluster

  secondary_ip_range {
    range_name = local.kubernetes_primary_cluster_services_secondary_range_name
    ip_cidr_range = module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_services_secondary_range
  }

  secondary_ip_range {
    range_name = local.kubernetes_primary_cluster_pod_cluster_secondary_range_name
    ip_cidr_range = module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_pod_cluster_secondary_range
  }
}

#######################
# VPN Subnet
#######################

resource "google_compute_subnetwork" "vpn" {
  name = "vpn"

  region  = var.region
  network = google_compute_network.primary.self_link

  private_ip_google_access = true
  ip_cidr_range = module.vpc_cidr_ranges.network_cidr_blocks.vpn
}