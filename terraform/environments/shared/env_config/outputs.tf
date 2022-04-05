output "env_config" {
  value = {
    "dev" = {
      "vpc_cidr_block" = "10.0.0.0/16"
    },
    "staging": {
      "vpc_cidr_block" = "10.1.0.0/16"
    },
    "prod": {
      "vpc_cidr_block" = "10.2.0.0/16"
    }
  }
}

output "mongo_atlas_org_id" {
  value = "613266a1347a1374f958cd7d"
}

output "jenkins_internal_load_balancer_name" {
  value = "jenkins-internal-load-balancer"
}