resource "kubernetes_config_map" "rairnode_configmap" {
  metadata {
    name = "rairnode-env"
  }

  data = var.rairnode_configmap_data
}