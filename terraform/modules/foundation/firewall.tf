# resource "google_compute_firewall" "test_1" {
#   name        = "test-1-relay-egress-to-gke"
#   network = google_compute_network.primary.id
#   description = "test-1-relay-egress-to-gke"

#   # allow {
#   #   protocol  = "tcp"
#   # }

#   # allow {
#   #   protocol  = "icmp"
#   # }

#   allow {
#     protocol  = "all"
#   }

#   direction = "EGRESS"

#   target_tags = [
#     local.tailscale_relay_vm_instance_tag
#   ]
  
#   destination_ranges = [
#     module.vpc_cidr_ranges.network_cidr_blocks.kubernetes_control_plane_range,
#     "0.0.0.0/0"
#   ]
# }

# resource "google_compute_firewall" "test_2" {
#   name        = "test-2-gke-ingress-from-relay"
#   network = google_compute_network.primary.id
#   description = "test-2-gke-ingress-from-relay"

#   # allow {
#   #   protocol  = "tcp"
#   # }

#   # allow {
#   #   protocol  = "icmp"
#   # }

#   allow {
#     protocol  = "all"
#   }

#   direction = "INGRESS"

#   target_tags = [
#     local.kubernetes_primary_cluster_tag,
#     "gke-primary-c50904f8-node"
#   ]
  
#   # source_tags = [
#   #   local.tailscale_relay_vm_instance_tag
#   # ]

#   source_ranges = [
#     module.vpc_cidr_ranges.network_cidr_blocks.public,
#     "0.0.0.0/0"
#   ]
# }


#################
# Ingress from everywhere to relay
# allows ssh to work temporarily
# resource "google_compute_firewall" "test_3" {
#   name        = "test-3-relay-ingress"
#   network = google_compute_network.primary.id
#   description = "test-3-relay-ingress"

#   allow {
#     protocol  = "all"
#   }

#   direction = "INGRESS"

#   target_tags = [
#     local.tailscale_relay_vm_instance_tag,
#   ]

#   source_ranges = [
#     "0.0.0.0/0"
#   ]
# }




# resource "google_compute_firewall" "test_4" {
#   name        = "test-4-relay-tag-to-relay-tag"
#   network = google_compute_network.primary.id
#   description = "test-4-relay-tag-to-relay-tag"

#   allow {
#     protocol  = "all"
#   }

#   direction = "EGRESS"

#   target_tags = [
#     local.tailscale_relay_vm_instance_tag
#   ]

#   source_tags = [
#    local.tailscale_relay_vm_instance_tag 
#   ]
# }