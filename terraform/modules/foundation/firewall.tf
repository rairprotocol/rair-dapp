resource "google_compute_firewall" "tailscale_relay_ssh_ingress" {
  name        = "tailscale-relay-ssh-ingress"
  network = google_compute_network.primary.id
  description = "tailscale-relay-ssh-ingress"
  
  # Setting this to disabled prevents any acces to the tailscale relay
  # If we need to debug the relay, set disabled = false, and add your
  # ip to your user whitelist in main.tf local variable
  disabled = true

  allow {
    protocol  = "tcp"
    ports = [22]
  }

  direction = "INGRESS"

  target_tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  # This will allow SSH port 22 access in form specific addresses
  source_ranges = concat(
    local.users.brian_fogg.allowed_IPs_v4
  )
}