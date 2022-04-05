output "env_config" {
  value = {
    "dev" = {
      "vpc_cidr_block" =              "10.0.0.0/16",
      "jenkins_internal_private_ip" = "10.0.64.1",
    },
    "staging": {
      "vpc_cidr_block" =              "10.1.0.0/16",
      "jenkins_internal_private_ip" = "10.1.64.1"
    },
    "prod": {
      "vpc_cidr_block" =              "10.2.0.0/16",
      "jenkins_internal_private_ip" = "10.2.64.1"
    }
  }
}

output "mongo_atlas_org_id" {
  value = "613266a1347a1374f958cd7d"
}