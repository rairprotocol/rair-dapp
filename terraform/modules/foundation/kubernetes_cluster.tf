locals {
  kubenetes_primary_cluster_name = "primary"
  kubernetes_location = local.avaliablity_zones.a
}

# Creates a Google Kubernetes Engine (GKE) cluster
# https://www.terraform.io/docs/providers/google/r/container_cluster.html
resource "google_container_cluster" "primary" {
  depends_on = [
    google_project_service.container,
    google_compute_route.default_public_route
  ]

  name                      = local.kubenetes_primary_cluster_name
  description               = "Kubernetes ${local.kubenetes_primary_cluster_name} cluster in ${local.kubernetes_location}"
  location                  = local.kubernetes_location

  network = google_compute_network.primary.id
  subnetwork = google_compute_subnetwork.private.id
  
  initial_node_count        = 1
  remove_default_node_pool  = true

#   addons_config {
#     horizontal_pod_autoscaling {
#       disabled = "${lookup(var.master, "disable_horizontal_pod_autoscaling", false)}"
#     }

#     http_load_balancing {
#       disabled = "${lookup(var.master, "disable_http_load_balancing", false)}"
#     }

#     kubernetes_dashboard {
#       disabled = "${lookup(var.master, "disable_kubernetes_dashboard", false)}"
#     }

#     network_policy_config {
#       disabled = "${lookup(var.master, "disable_network_policy_config", true)}"
#     }
#   }

#   # cluster_ipv4_cidr - default
#   enable_kubernetes_alpha = "${lookup(var.master, "enable_kubernetes_alpha", false)}"
#   enable_legacy_abac      = "${lookup(var.master, "enable_legacy_abac", false)}"
#   ip_allocation_policy    = "${var.ip_allocation_policy}"

#   maintenance_policy {
#     daily_maintenance_window {
#       start_time = "${lookup(var.master, "maintenance_window", "04:30")}"
#     }
#   }

#   # master_authorized_networks_config - disable (security)
#   min_master_version = "${lookup(var.master, "version", data.google_container_engine_versions.engine_version.latest_master_version)}"
#   node_version       = "${lookup(var.master, "version", data.google_container_engine_versions.engine_version.latest_node_version)}"
#   monitoring_service = "${lookup(var.master, "monitoring_service", "none")}"
#   logging_service    = "${lookup(var.master, "logging_service", "logging.googleapis.com")}"

#   node_config {
#     disk_size_gb    = "${lookup(var.default_node_pool, "disk_size_gb", 10)}"
#     disk_type       = "${lookup(var.default_node_pool, "disk_type", "pd-standard")}"
#     image_type      = "${lookup(var.default_node_pool, "image", "COS")}"
#     local_ssd_count = "${lookup(var.default_node_pool, "local_ssd_count", 0)}"
#     machine_type    = "${lookup(var.default_node_pool, "machine_type", "n1-standard-1")}"
#     # min_cpu_platform - disable (useless)

#     # BUG Provider - recreate loop
#     # guest_accelerator {
#     #   count = "${lookup(var.master, "gpus_number", 0)}"
#     #   type  = "${lookup(var.master, "gpus_type", "nvidia-tesla-k80")}"
#     # }

#     oauth_scopes    = ["${split(",", lookup(var.default_node_pool, "oauth_scopes", "https://www.googleapis.com/auth/compute,https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring"))}"]
#     preemptible     = "${lookup(var.default_node_pool, "preemptible", false)}"
#     service_account = "${lookup(var.default_node_pool, "service_account", "default")}"
#     labels          = "${var.labels}"
#     tags            = "${var.tags}"
#     metadata        = "${var.metadata}"
#   }
}