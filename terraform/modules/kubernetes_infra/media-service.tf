locals {
   media_service_namespace = "media-service-primary"
   media_service_default_port_1 = "5002"
   media_service_image = "rairtechinc/media-service:dev_2.34"
   media_service_configmap_name = "media-service-env"
}

resource "kubernetes_config_map" "media_service_configmap" {
  metadata {
    name = local.media_service_configmap_name
  }

  data = merge(
    local.redis_configmap_append,
    var.media_service_configmap_data
  )
}

resource "kubernetes_service" "media_service_service" {
  metadata {
    name      = local.media_service_namespace
    labels = {
      managedby = "terraform"
      service   = local.media_service_namespace
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "loadBalancer"
    }
  }
  spec {
    port {
      port        = 5002
      target_port = local.media_service_default_port_1
      name = "5002"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_deployment" "media_service" {
  depends_on = [
    kubernetes_config_map.media_service_configmap
  ]
  metadata {
    name = "${local.media_service_namespace}-deployment"
    labels = {
      managedby = "terraform"
    }
  }

  spec {
    
    replicas = 1

    selector {
      match_labels = {
        app = local.media_service_namespace
      }
    }

    template {
      metadata {
        labels = {
          app = local.media_service_namespace
        }
      }

      spec {
        service_account_name = module.shared_config.gke_service_accounts.media_service

        container {
          image = local.media_service_image
          name  = local.media_service_namespace
          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }
          image_pull_policy = "Always"
          port {
            container_port = "${local.media_service_default_port_1}"
          }
          env_from {
            config_map_ref {
              name = local.media_service_configmap_name
           }
          }
          env {
            name = var.namespace_secrets.default.env_secrets.mongodb-credential.env_reference_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.mongodb-credential.secret_name
                key = var.namespace_secrets.default.env_secrets.mongodb-credential.env_reference_name
              }
            }
          }
          env {
            name = var.namespace_secrets.default.env_secrets.pinata-secret.env_reference_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.pinata-secret.secret_name
                key = var.namespace_secrets.default.env_secrets.pinata-secret.env_reference_name
              }
            }
          }
          env {
            name = var.namespace_secrets.default.env_secrets.jwt-secret.env_reference_name
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.jwt-secret.secret_name
                key = var.namespace_secrets.default.env_secrets.jwt-secret.env_reference_name
              }
            }
          }
          env {
            name = "GCP_CREDENTIALS"
            value_from {
              secret_key_ref {
                name = var.namespace_secrets.default.env_secrets.rair-file-manager.secret_name
                key = var.namespace_secrets.default.env_secrets.rair-file-manager.env_reference_name
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
        name        = var.pull_secret_name
      }
      }
    }
  }
}