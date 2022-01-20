# Manages a Node Pool resource within GKE
# https://www.terraform.io/docs/providers/google/r/container_node_pool.html
resource "google_container_node_pool" "public_node_pool" {
  name       = "public"
  location   = local.avaliablity_zones.a
  node_count = 1
  cluster    = google_container_cluster.primary.name

  node_config {
    machine_type    = "e2-standard-2"
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 1
  }
}