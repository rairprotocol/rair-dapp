resource "google_service_account" "tailscale_relay" {
  account_id   = "tailscale-relay"
  display_name = "Tailscale Relay VM Service Account"
}

resource "google_service_account" "rair_file_manager" {
  account_id   = "rair-file-manager"
  display_name = "Rair manager for all files"
}

resource "google_service_account" "jenkins_gce" {
  account_id   = "jenkins-gce"
  display_name = "jenkins resource for building and deploying nodes"
}