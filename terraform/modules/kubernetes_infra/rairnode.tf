locals {
  rairnode_namespace = "rairnode-primary"
  rairnode_default_port_1 = "3000"
  rairnode_default_port_2 = "5000"
  rairnode_persistent_volume_claim_name_0 = "rairnode-claim0"
  rairnode_persistent_volume_claim_name_1 = "rairnode-claim1"
  rairnode_persistent_storage_name_0 = "rairnode-claim0"
  rairnode_persistent_storage_name_1 = "rairnode-claim1"
  rairnode_image = "rairtechinc/rairservernode:dev_2.30"
  rairnode_configmap_name = "rairnode-env"
}

resource "kubernetes_config_map" "rairnode_configmap" {
  metadata {
    name = local.rairnode_configmap_name
  }

  data = var.rairnode_configmap_data
}

resource "kubernetes_service" "rairnode_service" {
  metadata {
    name      = local.rairnode_namespace
    labels = {
      managedby = "terraform"
      service   = local.rairnode_namespace
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "loadBalancer"
    }
  }
  spec {
    port {
      port        = 3000
      target_port = local.rairnode_default_port_1
      name = "3000"
    }
    port {
      port        = 5000
      target_port = local.rairnode_default_port_2
      name = "5000"
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_persistent_volume_claim" "rairnode-claim0" {
  metadata {
    name      = local.rairnode_persistent_volume_claim_name_0
    labels = {
      managedby = "terraform"
    }
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "rairnode-claim1" {
  metadata {
    name      = local.rairnode_persistent_volume_claim_name_1
    labels = {
      managedby = "terraform"
    }
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "rairnode" {
  depends_on = [
    kubernetes_config_map.rairnode_configmap
  ]
  metadata {
    name = "${local.rairnode_namespace}-deployment"
    labels = {
      managedby = "terraform"
    }
  }

  spec {

    replicas = 1

    selector {
      match_labels = {
        app = local.rairnode_namespace
      }
    }

    template {
      metadata {
        labels = {
          app = local.rairnode_namespace
        }
      }

      spec {

        service_account_name = module.shared_config.gke_service_accounts.rairnode

        container {
          image = local.rairnode_image
          name  = local.rairnode_namespace
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
            container_port = "${local.rairnode_default_port_1}"
          }
          port {
            container_port = "${local.rairnode_default_port_2}"
          }
          env_from {
            config_map_ref {
              name = local.rairnode_configmap_name
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
           volume_mount {
            name       = local.rairnode_persistent_volume_claim_name_0
            mount_path = "/usr/local/src/db"
          }
          volume_mount {
            name       = local.rairnode_persistent_volume_claim_name_1
            mount_path = "/usr/local/src/bin/Videos"
          }
        }
      image_pull_secrets {
        name        = var.pull_secret_name
      }
      volume {
          name = local.rairnode_persistent_storage_name_0
          persistent_volume_claim {
            claim_name = local.rairnode_persistent_volume_claim_name_0
          }
        }
      volume {
          name = local.rairnode_persistent_storage_name_1
          persistent_volume_claim {
            claim_name = local.rairnode_persistent_volume_claim_name_1
          }
        }
      }
    }
  }
}