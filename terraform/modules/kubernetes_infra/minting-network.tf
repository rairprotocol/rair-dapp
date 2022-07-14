locals {
  minting_network_service = "minting-network-primary"
  minting_network_image = "rairtechinc/minting-network:dev_2.34"
  minting_network_default_port_1 = 3001
  minting_network_configmap_name = "minting-network-env"
}

data "google_compute_address" "rair_internal_load_balancer" {
  name = var.rair_internal_load_balancer_name
  project = var.gcp_project_id
  region = var.region
}

resource "kubernetes_config_map" "minting_network_configmap" {
  metadata {
    name = local.minting_network_configmap_name
  }

  data = var.minting_network_configmap_data
}

resource "kubernetes_ingress_v1" "minting_network_ingress" {
  metadata {
    name = "minting-network-public-ingress"
    annotations = {
      "kubernetes.io/ingress.allow-http": false
      "ingress.gcp.kubernetes.io/pre-shared-cert": var.minting_marketplace_managed_cert_name
      "kubernetes.io/ingress.global-static-ip-name": var.minting_marketplace_static_ip_name
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
                number = 80
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
    load_balancer_ip = data.google_compute_address.rair_internal_load_balancer.address
    selector = {
      app = local.minting_network_service
    }
    port {
      port        = 80
      target_port = local.minting_network_default_port_1
      name = "http"
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
