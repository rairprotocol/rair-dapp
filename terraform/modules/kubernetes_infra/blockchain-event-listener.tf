locals {
  blockchain_event_listener_namespace = "blockchain-event-listener-primary"
  blockchain_event_listener_image = "rairtechinc/blockchain-event-listener:dev_latest"
  blockchain_event_listener_default_port_1 = "5001"
  pull_secret_name = "regcred"
}



resource "kubernetes_config_map" "blockchain_event_listener_configmap" {
  metadata {
    name = "blockchain-event-listener-env"
  }
  data = var.blockchain_event_listener_configmap_data
}



resource "kubernetes_service" "blockchain_event_listener_service" {
  metadata {
    name = local.blockchain_event_listener_namespace
    labels =  {
      managedby = "terraform"
      service   = local.blockchain_event_listener_namespace
    }
  }

  spec {
    port {
      port        = 5001
      target_port = local.blockchain_event_listener_default_port_1
      name        = 5001
    }
    type = "LoadBalancer"
  }
}



resource "kubernetes_deployment" "blockchain_event_listener" {
  metadata {
    name =  "${local.blockchain_event_listener_namespace}-deployment"
    labels =  {
      managedby = "terraform"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.blockchain_event_listener_namespace
      }
    }
    
    strategy {
      type = "Recreate"
    }
    
    template {
      metadata {
        labels = {
          app = local.blockchain_event_listener_namespace
        }
      }

      spec {
        container {
          image = local.blockchain_event_listener_image
          name  = local.blockchain_event_listener_namespace
          image_pull_policy = "Always"
         
          port {
            container_port = "${local.blockchain_event_listener_default_port_1}"
          }

          env_from {
            config_map_ref {
              name = "blockchain-event-listener-env"
            }
          }

          env{
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = "mongodb-credential"
                key = "MONGO_URI"
              }
            }
          }

          env{
            name = "MONGO_URI_LOCAL"
            value_from {
              secret_key_ref {
                name = "mongodb-credential"
                key = "MONGO_URI"
              }
            }
          }

          env{
            name = "PINATA_SECRET"
            value_from {
              secret_key_ref {
                name = "pinata-secret"
                key = "PINATA_SECRET"
              }
            }
          }
          
          env{
            name = "MORALIS_MASTER_KEY_MAIN"
            value_from {
              secret_key_ref {
                name = "moralis-master_key_main"
                key = "MORALIS_MASTER_KEY_MAIN"
              }
            }
          }

          env{
            name = "MORALIS_MASTER_KEY_TEST"
            value_from {
              secret_key_ref {
                name = "moralis-master_key_test"
                key = "MORALIS_MASTER_KEY_TEST"
              }
            }
          }
        }
        image_pull_secrets {
          name = local.pull_secret_name
        }
      } 
    }
  }
}
