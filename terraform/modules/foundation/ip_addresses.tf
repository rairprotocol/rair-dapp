resource "google_compute_address" "ip_address" {
  project = var.gcp_project_id
  name = "primary-ingress-ip"
  region =var.region
}

resource "google_compute_address" "gke_nat" {
  name = "gke-nat"
  region =var.region
}

resource "google_compute_address" "rairnode_api_endpoint" {
  name = "rairnode-api-endpoint"
  region =var.region
 }