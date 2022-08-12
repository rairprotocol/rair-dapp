locals {
  redis_service = "redis-primary"
  redis_image = "redis:6.2.3-alpine"
  redis_default_port_1 = 6379
  redis_service_exposed_port = 80
  redis_runtime_command = "redis-server"
  redis_configmap_append = tomap({
    REDIS_HOST: data.google_compute_address.redis_internal_load_balancer.address,
    REDIS_PORT: local.redis_service_exposed_port,
  })
}

resource "kubernetes_service" "redis_service" {
  metadata {
    name = local.redis_service
    labels = {
      managedby = "terraform"
      service   = local.redis_service
    }
    annotations = {
      "networking.gke.io/load-balancer-type" = "Internal"
    }
  }
  spec {
    load_balancer_ip = data.google_compute_address.redis_internal_load_balancer.address
    selector = {
      app = local.redis_service
    }
    port {
      port        = local.redis_service_exposed_port
      target_port = local.redis_default_port_1
      name = "http"
    }
    type = "LoadBalancer"
  }
}
resource "kubernetes_deployment" "rair-redis" {
  metadata {
    name = "${local.redis_service}-deployment"
    labels = {
      managedby = "terraform"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.redis_service
      }
    }

    template {
      metadata {
        labels = {
          app = local.redis_service
        }
      }

      spec{
        subdomain = "primary"
        container {
          image = local.redis_image
          name  = local.redis_service
          image_pull_policy = "Always"
          command = ["redis-server"]
          args = ["--protected-mode", "no"]
          port {
            container_port = local.redis_default_port_1
          }
       }
     } 
    }
  }
} 
