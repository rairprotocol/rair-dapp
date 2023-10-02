resource "google_compute_route" "default_public_route" {
  network = google_compute_network.primary.id

  name                     = "default-public-route"
  description              = "Route to public internet"
  dest_range               = "0.0.0.0/0"
  next_hop_gateway         = "default-internet-gateway"
}