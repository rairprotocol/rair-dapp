resource "google_compute_network" "primary" {
  name = "primary"
  description = "Primary VPC network for Rair env: ${var.env_name}"
  auto_create_subnetworks = false
  routing_mode = "REGIONAL"
  delete_default_routes_on_create = true
}

#######################
# Public Subnet
#######################

resource "google_compute_subnetwork" "public" {
  name = "public"

  region  = var.region
  network = google_compute_network.primary.self_link

  private_ip_google_access = true
  ip_cidr_range = cidrsubnet(var.vpc_cidr_block, 8, 0)
}

#######################
# Private Subnet
#######################

resource "google_compute_subnetwork" "private" {
  name = "private"

  region  = var.region
  network = google_compute_network.primary.self_link

  private_ip_google_access = true
  ip_cidr_range = cidrsubnet(var.vpc_cidr_block, 8, 1)
}