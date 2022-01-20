resource "google_compute_network" "primary" {
  name = "primary"
  description = "Primary VPC network for Rair env: ${var.env_name}"
  auto_create_subnetworks = false
  routing_mode = "REGIONAL"
  delete_default_routes_on_create = true
}

module "subnets" {
  source = "hashicorp/subnets/cidr"

  base_cidr_block = var.vpc_cidr_block
  networks = [
    {
      name     = "private"
      new_bits = 8
    },
    {
      name = "kubernetes_primary_cluster",
      new_bits = 2
    },
    {
      name = "kubernetes_pod_cluster_secondary_range",
      new_bits = 4
    },
    {
      name = "kubernetes_services_secondary_range",
      new_bits = 4
    },
    {
      name = "kubernetes_control_plane_range",
      new_bits = 12
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
  ip_cidr_range = module.subnets.network_cidr_blocks.kubernetes_primary_cluster

  secondary_ip_range {
    range_name = local.kubernetes_primary_cluster_services_secondary_range_name
    ip_cidr_range = module.subnets.network_cidr_blocks.kubernetes_services_secondary_range
  }

  secondary_ip_range {
    range_name = local.kubernetes_primary_cluster_pod_cluster_secondary_range_name
    ip_cidr_range = module.subnets.network_cidr_blocks.kubernetes_pod_cluster_secondary_range
  }
}

#######################
# Private Subnet
#######################

resource "google_compute_subnetwork" "private" {
  name = "private"

  region  = var.region
  network = google_compute_network.primary.self_link

  private_ip_google_access = true
  ip_cidr_range = module.subnets.network_cidr_blocks.private
}