resource "google_compute_router" "gke_router" {
  name    = "gke-router"
  region  = var.region
  network = google_compute_network.primary.id
}

resource "google_compute_router_nat" "gke_nat" {
  name                               = "${google_compute_router.gke_router.name}-nat"
  router                             = google_compute_router.gke_router.name
  region                             = google_compute_router.gke_router.region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  nat_ips = [google_compute_address.gke_nat.self_link]

  subnetwork {
    name = google_compute_subnetwork.kubernetes_primary_cluster.name
    source_ip_ranges_to_nat = ["PRIMARY_IP_RANGE"]
  }
}