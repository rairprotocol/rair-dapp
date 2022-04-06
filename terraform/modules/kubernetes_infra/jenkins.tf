locals {
  jenkins_namespace = "jenkins-primary"
  jenkins_image = "jenkins/jenkins:latest"
  jenkins_persistent_storage_name = "${local.jenkins_namespace}-persistent-storage"
  jenkins_persistent_volume_claim_name = "${local.jenkins_namespace}-claim"
  jenkins_default_port = 8080
}

resource "kubernetes_persistent_volume_claim" "claim" {
  metadata {
    name      = local.jenkins_persistent_volume_claim_name
    labels = {
      managedby = "terraform"
    }
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "20Gi"
      }
    }
  }
}

data "google_compute_address" "jenkins_internal_load_balancer" {
  name = var.jenkins_internal_load_balancer_name
  project = var.gcp_project_id
  region = var.region
}

resource "kubernetes_deployment" "jenkins" {
  metadata {
    name = "${local.jenkins_namespace}-deployment"
    labels = {
      managedby = "terraform"
    }
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
        security_context {
          fs_group = 1000
          run_as_user = 0
        }

        container {
          image = local.jenkins_image
          name  = local.jenkins_namespace
          port {
            container_port = "${local.jenkins_default_port}"
          }
          volume_mount {
            name       = local.jenkins_persistent_storage_name
            mount_path = "/var/jenkins_home"
          }
        }
        volume {
          name = local.jenkins_persistent_storage_name
          persistent_volume_claim {
            claim_name = local.jenkins_persistent_volume_claim_name
          }
        }
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
    load_balancer_ip = data.google_compute_address.jenkins_internal_load_balancer.address
    selector = {
      app = local.jenkins_namespace
    }
    port {
      port        = 80
      target_port = local.jenkins_default_port
      name = "http"
    }
    type = "LoadBalancer"
  }
}