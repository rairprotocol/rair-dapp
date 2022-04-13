locals {
  minting_network_service = "minting-network-primary"
  minting_network_image = "rairtechinc/minting-network:dev_latest"
  minting_network_default_port_1 = "3001"
  //pull_secret_name = "regcred"
}



resource "kubernetes_config_map" "minting_network_configmap" {
  metadata {
    name = "minting-network-env"
  }

  data = var.minting_network_configmap_data
}



resource "kubernetes_service" "minting_network_service" {
  metadata {
    name = local.minting_network_service
    labels = {
      managedby = "terraform"
      service   = local.minting_network_service
    }
  }

  spec {
    port {
      port        = local.minting_network_default_port_1
      target_port =  local.minting_network_default_port_1
      name        = local.minting_network_default_port_1
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
       container {
        image = local.minting_network_image
        name  = local.minting_network_service
        image_pull_policy = "Always"
        
        port {
          container_port = local.minting_network_default_port_1
        }
       }
      image_pull_secrets {
        name = var.pull_secret_name
      }
     } 
    }
  }
} 
