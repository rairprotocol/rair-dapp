resource "google_compute_firewall" "tailscale_relay_ssh" {
  name        = "tailscale-relay-ssh"
  network = google_compute_network.primary.id
  description = "tailscale-relay-ssh"
  
  disabled = false

  allow {
    protocol  = "tcp"
    ports = [22]
  }

  direction = "INGRESS"

  target_tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  # This will allow SSH port 22 access in from the entire internet
  # This rule will be disabled after Tailscale is properly working
  source_ranges = [
    "0.0.0.0/0"
  ]
}


################################################
# Instance 1 / Relay integration
# ping instance 1 test from tailscale relay

resource "google_compute_firewall" "ping_instance_1_ingress" {
  name        = "ping-instance-1-ingress"
  network = google_compute_network.primary.id
  description = "ping-instance-1-ingress"
  
  disabled = true

  allow {
    protocol  = "icmp"
  }

  direction = "INGRESS"

  target_tags = [
    local.instance_1_test_tag
  ]

  source_tags = [
   local.tailscale_relay_vm_instance_tag
  ]
}


# Do the same thing, but without tags, just use cidr ranges
resource "google_compute_firewall" "ping_instance_1_ingress_cidr_range_test" {
  name        = "ping-instance-1-ingress-cidr-range-test"
  network = google_compute_network.primary.id
  description = "ping-instance-1-ingress-cidr-range-test"
  
  disabled = false

  allow {
    protocol  = "icmp"
  }

  direction = "INGRESS"

  target_tags = [
    local.instance_1_test_tag
  ]

  source_ranges = [
    module.vpc_cidr_ranges.network_cidr_blocks.public
  ]
}

# Ok, so this works just fine
# Now let's try pinging the kubernetes endpoing

# this does not work, let's try a security group
# ping 10.0.160.2

# Do the same thing, but without tags, just use cidr ranges
resource "google_compute_firewall" "ping_ingress_from_tailscale_to_gke" {
  name        = "ping-ingress-from-tailscale-to-gke"
  network = google_compute_network.primary.id
  
  disabled = false

  allow {
    protocol  = "icmp"
  }

  direction = "INGRESS"

  target_tags = [
    local.public_node_pool_network_tag
  ]

  source_ranges = [
    module.vpc_cidr_ranges.network_cidr_blocks.public
  ]
}

# does not work yet, maybe the relay needs the egress to match this
resource "google_compute_firewall" "ping_egress_from_tailscale_to_gke" {
  name        = "ping-egress-from-tailscale-to-gke"
  network = google_compute_network.primary.id
  
  disabled = true

  allow {
    protocol  = "icmp"
  }

  direction = "EGRESS"

  target_tags = [
    local.tailscale_relay_vm_instance_tag
  ]

  destination_ranges = [
    module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_control_plane_range
  ]
}

# TODO: figure out if UDP packet egress from tailscale is working now
# if it's not, try adding it

# TODO: remove public IP from tailscale relay
# should be able to delete the acces_config block from the template