locals {
    rair_ingress_name = "rair-ingress"
}
resource "kubernetes_ingress" "rair_ingress" {
  metadata {
    name = local.rair_ingress_name
  }

  spec {
    backend {
      service_name = local.minting_network_service
      service_port = local.minting_network_default_port_1
    }


    rule {
      host = "new.dev.rair.tech"
      http {
        path {
          backend {
            service_name = local.minting_network_service
            service_port = local.minting_network_default_port_1
          }

          path = "/*"
        }
      }
    }

//    tls {
//      secret_name = "tls-secret"
//    }
  }
}