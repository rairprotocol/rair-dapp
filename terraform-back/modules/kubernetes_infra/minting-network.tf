locals {
  minting_network_service = "minting-network-primary"
  minting_network_image = "rairtechinc/minting-network:4021cc5ecbbc2d58b2cbed62760369356003d80d"
  minting_network_default_port_1 = 443
  minting_network_configmap_name = "minting-network-env"
}

resource "kubernetes_config_map" "minting_network_configmap" {
  metadata {
    name = local.minting_network_configmap_name
  }

  data = merge(
    local.redis_configmap_append,
    var.minting_network_configmap_data
  )
}

resource "kubernetes_ingress_v1" "minting_network_ingress" {
  count = var.enable_public_ingress_minting_marketplace == true ? 1 : 0
  
  metadata {
    name = "minting-network-public-ingress"
    annotations = {
      "kubernetes.io/ingress.allow-http": false
      "ingress.gcp.kubernetes.io/pre-shared-cert": module.shared_config.minting_marketplace_managed_cert_name
      "kubernetes.io/ingress.global-static-ip-name": module.shared_config.minting_marketplace_static_ip_name
    }
  } 

  wait_for_load_balancer = true

  spec {
    rule {
      http {
        path {
          path = "/*"
          backend {
            service {
              name = local.minting_network_service
              port {
                number = 443
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "minting_network_service" {
  metadata {
    name = local.minting_network_service
    labels = {
      managedby = "terraform"
      service   = local.minting_network_service
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "Internal"
    }
  }
  spec {
    load_balancer_ip = data.google_compute_address.minting_marketplace_internal_load_balancer.address
    selector = {
      app = local.minting_network_service
    }
    port {
      port        = 443
      target_port = local.minting_network_default_port_1
      name = "https"
    }
    type = "LoadBalancer"
  }
}
resource "kubernetes_deployment" "minting_network" {
  metadata {
    name = "${local.minting_network_service}-deployment"
    labels = {
      managedby = "terraform"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.minting_network_service
      }
    }

    template {
      metadata {
        labels = {
          app = local.minting_network_service
        }
      }

      spec{
        
        service_account_name = module.shared_config.gke_service_accounts.minting_network

        container {
          image = local.minting_network_image
          name  = local.minting_network_service
          image_pull_policy = "Always"
        
          port {
            container_port = local.minting_network_default_port_1
          }
          env_from {
            config_map_ref {
              name = local.minting_network_configmap_name
            }
          }
       }
      image_pull_secrets {
        name = var.pull_secret_name
      }
     } 
    }
  }
} 
