locals {
  rairnode_namespace = "rairnode-primary"
  rairnode_default_port_1 = "3000"
  rairnode_default_port_2 = "5000"
  rairnode_persistent_volume_claim_name_0 = "rairnode-claim0"
  rairnode_persistent_volume_claim_name_1 = "rairnode-claim1"
  rairnode_image = "rairtechinc/rairservernode:dev_latest"
  pull_secret_name = "regcred"
}

resource "kubernetes_config_map" "rairnode_configmap" {
  metadata {
    name = "rairnode-env"
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
      "networking.gke.io/load-balancer-type" = "Internal"
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

    type = "LoadBalancer"
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
              name = "rairnode-env"
            }
          }
          env {
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = "mongodb-credential"
                key = "MONGO_URI"
              }
            }
          }
          env {
            name = "PINATA_SECRET"
            value_from {
              secret_key_ref {
                name = "pinata-secret"
                key = "PINATA_SECRET"
              }
            }
          }
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = "jwt-secret"
                key = "JWT_SECRET"
              }
            }
          }
          env {
            name = "GCP_CREDENTIALS"
            value_from {
              secret_key_ref {
                name = "rair-manager-key"
                key = "key.json"
              }
            }
          }
/*           volume_mount {
            name       = local.rairnode_persistent_volume_claim_name_0
            mount_path = "/usr/local/src/db"
          }
          volume_mount {
            name       = local.rairnode_persistent_volume_claim_name_1
            mount_path = "/usr/local/src/bin/Videos"
          } */
        }
      image_pull_secrets {
        name        = local.pull_secret_name
      }
      }
    }
  }
}