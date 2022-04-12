locals {
  blockchain_event_listener_namespace = var.namespace_secrets.default.namespace
  blockchain_event_listener_service = "blockchain-event-listener-primary"
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
    type = "LoadBalancer"
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
        container {
          image = local.blockchain_event_listener_image
          name  = local.blockchain_event_listener_service
          image_pull_policy = "Always"
         
          port {
            container_port = local.blockchain_event_listener_default_port_1
          }

          env_from {
            config_map_ref {
              name = "blockchain-event-listener-env"
            }
          }

          env{
            name = var.namespace_secrets.default.env_secrets.mongodb-credential.secret_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.mongodb-credential.secret_name
                key = var.namespace_secrets.default.env_secrets.mongodb-credential.env_reference_name
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
            name = var.namespace_secrets.default.env_secrets.pinata-secret.secret_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.pinata-secret.secret_name
                key = var.namespace_secrets.default.env_secrets.pinata-secret.env_reference_name
              }
            }
          }
          
          env{
            name = var.namespace_secrets.default.env_secrets.moralis-master-key-main.secret_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.moralis-master-key-main.secret_name
                key = var.namespace_secrets.default.env_secrets.moralis-master-key-main.env_reference_name
              }
            }
          }

          env{
            name = var.namespace_secrets.default.env_secrets.moralis-master-key-test.secret_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.moralis-master-key-test.secret_name
                key = var.namespace_secrets.default.env_secrets.moralis-master-key-test.env_reference_name
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
