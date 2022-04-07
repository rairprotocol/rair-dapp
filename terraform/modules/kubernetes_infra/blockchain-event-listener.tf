resource "kubernetes_config_map" "blockchain_event_listener_configmap" {
  metadata {
    name = "blockchain_event_listener-env"
  }

  data = var.blockchain_event_listener
}