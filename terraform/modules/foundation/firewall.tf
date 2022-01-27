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
    # We might need to get this with a data query, we're not specifying it anywhere, it's emergent
    "gke-primary-99c1bc47-node"
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

# So, ping doesn't work from tailscale to endpoint
# ping 10.0.160.2
# maybe there's nothing at this endpoint to ping
# let's try curling it

# curl -k https://10.0.160.2
# {
# "kind": "Status",
# "apiVersion": "v1",
# "metadata": {
  
# },
# "status": "Failure",
# "message": "forbidden: User \"system:anonymous\" cannot get path \"/\"",
# "reason": "Forbidden",
# "details": {
  
# },
# "code": 403
# interesting that this works. what's enabling this?


# looks like this rule allows it by default
# gke-primary-99c1bc47-vms
# Ingress
# gke-primary-99c1bc47-node	
# IP ranges: 10.0.64.0/18	
# tcp:1-65535
# udp:1-65535
# icmp

# this would be the cidr range for kubernetes_primary_cluster

# also allowing from this default rule:

# gke-primary-99c1bc47-all
# Ingress
# gke-primary-99c1bc47-node	
# IP ranges: 10.0.128.0/20	
# tcp
# udp
# icmp;esp;ah;sctp

# Where did this IP come from?
# 10.0.128.0/20

# We're currently running from "10.0.0.13"

# trying to just simply connect to the GKE from bastion:

# gcloud container clusters get-credentials primary --zone us-west1-a --project rair-market-dev

# Fetching cluster endpoint and auth data.
# ERROR: (gcloud.container.clusters.get-credentials) ResponseError: code=403, message=Required "container.clusters.ge
# t" permission(s) for "projects/rair-market-dev/zones/us-west1-a/clusters/primary".


# ########################
# Let's just try getting the ping through the relay

# ping 10.0.64.5

# Try adding:
  # allow {
  #   protocol  = "all"
  # }
# to tailscale ingress
# does not work