locals {
  minting_network_namespace = "minting-network-primary"
  minting_network_image = "rairtechinc/minting-network:dev_latest"
  minting_network_default_port_1 = "3001"
  pull_secret_name = "regcred"
}



resource "kubernetes_config_map" "minting_network_configmap" {
  metadata {
    name = "minting-network-env"
  }

  data = var.minting_network_configmap_data
}



resource "kubernetes_service" "minting_network_service" {
  metadata {
    name = local.minting_network_namespace
    labels = {
      managedby = "terraform"
      service   = local.minting_network_namespace
    }
  }
  spec {
    port {
      port        = 3001
      target_port =  local.minting_network_default_port_1
      name        = "3001"
    }
  }
}



resource "kubernetes_deployment" "minting_network" {
  metadata {
    name = "${local.minting_network_namespace}-deployment"
    labels = {
      managedby = "terraform"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.minting_network_namespace
      }
    }

    template {
     metadata {
       labels = {
         app = local.minting_network_namespace
       }
     }

     spec{
       container {
        image = local.minting_network_image
        name  = local.minting_network_namespace
        image_pull_policy = "Always"
        
        port {
          container_port = "${local.minting_network_default_port_1}"
        }
       }
      image_pull_secrets {
        name = local.pull_secret_name
      }
     } 
    }
  }
} 
