output "env_config" {
  value = {
    "dev": {
      env_name: "dev",
      vpc_cidr_block: "10.0.0.0/14",
      gcp_project_id: "rair-market-dev",
      region: "us-west1"
    },
    "staging": {
      env_name: "staging",
      vpc_cidr_block: "10.4.0.0/14",
      gcp_project_id: "rair-market-staging",
      region: "us-west1"
    },
    "prod": {
      env_name: "prod",
      vpc_cidr_block: "10.8.0.0/14",
      gcp_project_id: "rair-market-production",
      region: "us-west1"
    }
  }
}

output "mongo_atlas_org_id" {
  value = "613266a1347a1374f958cd7d"
}

output "jenkins_internal_load_balancer_name" {
  value = "jenkins-internal-load-balancer"
}

output "rair_internal_load_balancer_name" {
  value = "rair-internal-load-balancer"
}

output "users" {
  value = {
    brian: {
      email: "brian@rair.tech"
    },
    chris: {
      email: "chris@rair.tech"
    },
    zeph: {
      email: "zeph@rair.tech"
    },
    garrett: {
      email: "garrett@rair.tech"
    },
    ramki: {
      email: "ramki@rair.tech"
    }
  }
}