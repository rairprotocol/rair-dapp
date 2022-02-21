resource "google_compute_address" "ip_address" {
  project = var.gcp_project_id
  name = "primary-ingress-ip"
  region =var.region
}