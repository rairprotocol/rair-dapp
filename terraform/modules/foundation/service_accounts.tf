resource "google_service_account" "tailscale_relay" {
  account_id   = "tailscale-relay"
  display_name = "Tailscale Relay VM Service Account"
}