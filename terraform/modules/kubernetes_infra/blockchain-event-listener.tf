resource "kubernetes_config_map" "blockchain_event_listener_configmap" {
  metadata {
    name = "blockchain-event-listener-env"
  }

  data = var.blockchain_event_listener_configmap_data
}