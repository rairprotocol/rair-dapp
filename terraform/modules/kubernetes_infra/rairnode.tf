resource "kubernetes_config_map" "rairnode_configmap" {
  metadata {
    name = "rairnode-configmap"
  }

  data = var.rairnode_configmap_data
}