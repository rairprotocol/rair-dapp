locals {
  rairnode_namespace = "rairnode-primary"
  rairnode_service_name = "${local.rairnode_namespace}-service"
  rairnode_default_port = 5000
  rairnode_persistent_volume_claim_name_0 = "rairnode-claim0"
  rairnode_persistent_volume_claim_name_1 = "rairnode-claim1"
  rairnode_persistent_storage_name_0 = "rairnode-claim0"
  rairnode_persistent_storage_name_1 = "rairnode-claim1"
  # rairnode_image = "rairtechinc/rairservernode:dev_2.131"
  rairnode_image = "rairtechinc/rairservernode:df79355b1a2b850a4cc1cdedfee5dc8e2ffdde0d"
  rair_ingress_name = "rair-ingress"
  rairnode_configmap_name = "rairnode-env"
}

resource "kubernetes_config_map" "rairnode_configmap" {
  metadata {
    name = local.rairnode_configmap_name
  }

  data = merge(
    local.redis_configmap_append,
    var.rairnode_configmap_data
  )
}

resource "kubernetes_service" "rairnode_service" {
  metadata {
    name      = local.rairnode_service_name
    labels = {
      managedby = "terraform"
      service   = local.rairnode_service_name
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "Internal"
    }
  }
  spec {
    load_balancer_ip = data.google_compute_address.rair_internal_load_balancer.address
    selector = {
      app = local.rairnode_namespace
    }
    port {
      port        = local.rairnode_default_port
      target_port = "${local.rairnode_default_port}"
      name = "${local.rairnode_default_port}"
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
            container_port = "${local.rairnode_default_port}"
          }
          env_from {
            config_map_ref {
              name = local.rairnode_configmap_name
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

resource "kubernetes_ingress_v1" "rairnode_ingress" {
  metadata {
    name = local.rair_ingress_name
    annotations = {
      "kubernetes.io/ingress.allow-http": false
      "ingress.gcp.kubernetes.io/pre-shared-cert": module.shared_config.rairnode_managed_cert_name
      "kubernetes.io/ingress.global-static-ip-name": module.shared_config.rairnode_static_ip_name
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
              name = local.rairnode_service_name
              port {
                number = local.rairnode_default_port
              }
            }
          }
        }
      }
    }
  }
}
