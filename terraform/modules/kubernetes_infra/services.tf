locals {
  rairnode_name = "rairnode"
}

resource "kubernetes_service" "rairnode" {
  metadata {
    annotations = {
      "kompose.cmd": "kompose convert",
      "kompose.version": "1.22.0 (955b78124)"
    }
    labels = {
      "io.kompose.service": local.rairnode_name
    }
    name = local.rairnode_name
  }

  spec {
    selector = {
      "io.kompose.service": local.rairnode_name
    }

    port {
      name = "3000"
      port = 3000
      target_port = 3000
    }

    port {
      name = "5000"
      port = 5000
      target_port = 5000
    }

    type = "LoadBalancer"
  }
}
