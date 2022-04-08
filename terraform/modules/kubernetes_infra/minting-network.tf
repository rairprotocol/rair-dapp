resource "kubernetes_config_map" "minting_network_configmap" {
  metadata {
    name = "minting-network-env"
  }

  data = var.minting_network_configmap_data
}