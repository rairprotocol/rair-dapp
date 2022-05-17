locals {
  kubenetes_primary_cluster_name = "primary"
  kubernetes_location = local.avaliablity_zones.a
}

# Creates a Google Kubernetes Engine (GKE) cluster
# https://www.terraform.io/docs/providers/google/r/container_cluster.html
resource "google_container_cluster" "primary" {
  depends_on = [
    google_project_service.container,
    google_project_service.cloud_resource_manager,
    google_compute_route.default_public_route
  ]

  name                      = local.kubenetes_primary_cluster_name
  description               = "Kubernetes ${local.kubenetes_primary_cluster_name} cluster in ${local.kubernetes_location}"
  location                  = local.kubernetes_location

  #scaling options
  cluster_autoscaling {
    enabled = true
    resource_limits {
      resource_type = "cpu"
      minimum = 1
      maximum = 10
    }
    resource_limits {
      resource_type = "memory"
      minimum = 4
      maximum = 32
    }
  }
  
  addons_config {
    http_load_balancing {
      disabled = true
    }

    horizontal_pod_autoscaling {
      disabled = true
    }
  }

  network = google_compute_network.primary.id
  subnetwork = google_compute_subnetwork.kubernetes_primary_cluster.id
  
  initial_node_count        = 1
  remove_default_node_pool  = true

  networking_mode = "VPC_NATIVE"

  private_cluster_config {
    enable_private_nodes = true
    enable_private_endpoint = true
    master_ipv4_cidr_block = module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_control_plane_range
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  master_authorized_networks_config {
    # This cidr block sets up a firewall rule on the VPC we're pairing with
    # these firewall rules will not show up in our firewall rule list
    cidr_blocks {
      display_name = "Ingress traffic from vpn subnet (allows tailscale relay access)"
      cidr_block = module.vpc_cidr_ranges.network_cidr_blocks.vpn
    }
  }

  default_max_pods_per_node = 110

  ip_allocation_policy {
    cluster_secondary_range_name = local.kubernetes_primary_cluster_pod_cluster_secondary_range_name
    services_secondary_range_name = local.kubernetes_primary_cluster_services_secondary_range_name
  }
}