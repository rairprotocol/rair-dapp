locals {
  jenkins_namespace = "jenkins-primary"
  jenkins_image = "jenkins/jenkins:latest"
  jenkins_node_port = 32000
}

# resource "kubernetes_namespace" "jenkins_namespace" {
#   count = var.create_namespace ? 1 : 0
#   metadata {
#     annotations = {
#       name = "jenkins"
#     }

#     labels = {
#       managedby = "terraform"
#     }

#     name = var.namespace
#   }
# }

# resource "kubernetes_persistent_volume_claim" "claim" {
#   metadata {
#     name      = "${var.name}-claim"
#     namespace = var.namespace
#     labels = {
#       managedby = "terraform"
#     }
#   }
#   spec {
#     access_modes = [var.accessmode]
#     resources {
#       requests = {
#         storage = var.request_storage
#       }
#     }
#     storage_class_name = var.storageclass
#   }
#   depends_on = [
#     kubernetes_namespace.jenkins_namespace
#   ]
# }

resource "kubernetes_deployment" "jenkins" {
  # depends_on = [
  #   kubernetes_namespace.jenkins_namespace
  # ]

  metadata {
    name = "${local.jenkins_namespace}-deployment"
    labels = {
      managedby = "terraform"
    }
    # namespace = local.jenkins_namespace
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = local.jenkins_namespace
      }
    }

    template {
      metadata {
        labels = {
          app = local.jenkins_namespace
        }
      }

      spec {
        container {
          image = local.jenkins_image
          name  = local.jenkins_namespace
          port {
            container_port = "8080"
          }
          # volume_mount {
          #   name       = "${var.name}-persistent-storage"
          #   mount_path = "/var/jenkins_home"
          # }
          #   TODO: liveness probe
        }
        # security_context {
        #   fs_group = "1000"
        # }
        # volume {
        #   name = "${var.name}-persistent-storage"
        #   persistent_volume_claim {
        #     claim_name = "${var.name}-claim"
        #   }
        # }
      }
    }
  }
}

resource "kubernetes_service" "jenkins_service" {
  metadata {
    name      = local.jenkins_namespace
    labels = {
      managedby = "terraform"
      service   = local.jenkins_namespace
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "Internal"
    }
  }
  spec {
    # health_check_node_port = 30000
    # external_traffic_policy = "Local"
    selector = {
      app = local.jenkins_namespace
    }
    port {
      port        = 8080
      target_port = 8080
      node_port = local.jenkins_node_port
      name = "http"
    }
    type = "LoadBalancer"
  }
}

# resource "kubernetes_service_account" "thia" {
#   metadata {
#     name      = "${var.name}-admin"
#     namespace = var.namespace
#   }
# }

# resource "kubernetes_cluster_role_binding" "this" {
#   metadata {
#     name = "${var.name}-rbac"
#   }
#   role_ref {
#     api_group = "rbac.authorization.k8s.io"
#     kind      = "ClusterRole"
#     name      = "cluster-admin"
#   }
#   subject {
#     kind      = "ServiceAccount"
#     name      = "${var.name}-admin"
#     namespace = var.namespace
#   }
# }