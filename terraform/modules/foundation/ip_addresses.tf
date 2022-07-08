resource "google_compute_address" "ip_address" {
  project = var.gcp_project_id
  name = "primary-ingress-ip"
  region =var.region
}

resource "google_compute_address" "gke_nat" {
  name = "gke-nat"
  region =var.region
}

resource "google_compute_address" "rair_internal_load_balancer" {
  name = var.rair_internal_load_balancer_name
  region = var.region
  address_type = "INTERNAL"
  subnetwork = google_compute_subnetwork.kubernetes_primary_cluster.id
}

resource "google_compute_address" "jenkins_internal_load_balancer" {
  name = var.jenkins_internal_load_balancer_name
  region = var.region
  address_type = "INTERNAL"
  subnetwork = google_compute_subnetwork.kubernetes_primary_cluster.id
 }

resource "google_compute_global_address" "minting_network" {
  name = var.minting_marketplace_static_ip_name
}