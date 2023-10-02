locals {
  mongodb_cloud_provider_name = "GCP"
}

resource "mongodbatlas_project" "primary" {
  name   = "primary-${var.env_name}-tf-managed"
  org_id = var.mongo_atlas_org_id
}

resource "mongodbatlas_network_container" "primary" {
  project_id       = mongodbatlas_project.primary.id
  atlas_cidr_block = module.vpc_cidr_ranges.network_cidr_blocks.mongo_primary_cluster_range
  provider_name    = local.mongodb_cloud_provider_name
}

# Create the peering connection request
resource "mongodbatlas_network_peering" "primary" {
  project_id     = mongodbatlas_project.primary.id
  container_id   = mongodbatlas_network_container.primary.container_id
  provider_name  = local.mongodb_cloud_provider_name
  gcp_project_id = var.gcp_project_id
  network_name   = google_compute_network.primary.name
}

# Create the GCP peer
resource "google_compute_network_peering" "mongodb_primary" {
  name         = "mongodb-cluster-primary-network-peering"
  network      = google_compute_network.primary.self_link
  peer_network = "https://www.googleapis.com/compute/v1/projects/${mongodbatlas_network_peering.primary.atlas_gcp_project_id}/global/networks/${mongodbatlas_network_peering.primary.atlas_vpc_name}"
}

locals {
  primary_db_access_map = [
    {
      cidr_block: module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_primary_cluster,
      comment: "Allows access to db from kubernetes_primary_cluster subnet cidr range."
    },
    {
      cidr_block: module.vpc_cidr_ranges.network_cidr_blocks.vpn,
      comment: "Allows access from Dev computers directly to DB (Tailscale vpn subnet)"
    }
  ]
}

resource "mongodbatlas_project_ip_access_list" "primary_access_list" {
  depends_on = [mongodbatlas_network_peering.primary]
  count = length(local.primary_db_access_map)

  project_id = mongodbatlas_project.primary.id

  cidr_block = local.primary_db_access_map[count.index].cidr_block
  comment    = local.primary_db_access_map[count.index].comment
}