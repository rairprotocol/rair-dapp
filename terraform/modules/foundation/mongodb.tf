locals {
  mongodb_cloud_provider_name = "GCP"
}

resource "mongodbatlas_project" "primary" {
  name   = "primary-${var.env_name}"
  org_id = var.mongo_atlas_org_id
}

# Container example provided but not always required, 
# see network_container documentation for details. 
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