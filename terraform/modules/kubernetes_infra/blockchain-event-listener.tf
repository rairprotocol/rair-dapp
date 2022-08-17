locals {
  blockchain_event_listener_namespace = var.namespace_secrets.default.namespace
  blockchain_event_listener_service = "blockchain-event-listener-primary"
  # blockchain_event_listener_image = "rairtechinc/blockchain-event-listener:dev_2.131"
  blockchain_event_listener_image = "rairtechinc/blockchain-event-listener:1aa03211ec4bd82e28af48af91a81cb8bcf70e54"
  blockchain_event_listener_default_port_1 = "5001"
  blockchain_event_listener_config_map = "blockchain-event-listener-env"
}



resource "kubernetes_config_map" "blockchain_event_listener_configmap" {
  metadata {
    name = local.blockchain_event_listener_config_map
  }
  data = merge(
    var.blockchain_event_listener_configmap_data,
    local.redis_configmap_append
  )
}



resource "kubernetes_service" "blockchain_event_listener_service" {
  metadata {
    name = local.blockchain_event_listener_service
    labels =  {
      managedby = "terraform"
      service   = local.blockchain_event_listener_service
    }
  }

  spec {
    port {
      port        = local.blockchain_event_listener_default_port_1
      target_port = local.blockchain_event_listener_default_port_1
      name        = local.blockchain_event_listener_default_port_1
    }
    type = "ClusterIP"
  }
}



resource "kubernetes_deployment" "blockchain_event_listener" {
  metadata {
    name =  "${local.blockchain_event_listener_service}-deployment"
    labels =  {
      managedby = "terraform"
    }
  }

  spec {

    replicas = 1
    selector {
      match_labels = {
        app = local.blockchain_event_listener_service
      }
    }
    
    strategy {
      type = "Recreate"
    }
    
    template {
      metadata {
        labels = {
          app = local.blockchain_event_listener_service
        }
      }

      spec {
        
        service_account_name = module.shared_config.gke_service_accounts.blockchain_networks

        container {
          image = local.blockchain_event_listener_image
          name  = local.blockchain_event_listener_service
          image_pull_policy = "Always"
         
          port {
            container_port = local.blockchain_event_listener_default_port_1
          }

          env_from {
            config_map_ref {
              name = local.blockchain_event_listener_config_map
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
