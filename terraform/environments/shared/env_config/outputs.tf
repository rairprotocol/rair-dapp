output "env_config" {
  value = {
    "dev": {
      env_name: "dev",
      vpc_cidr_block: "10.0.0.0/14",
      gcp_project_id: "rair-market-dev",
      region: "us-west1",
      obfuscated_project_id: "4249348029",
      minting_marketplace_subdomain: "dev",
      rairnode_subdomain: "dev-rairnode"
    },
    "staging": {
      env_name: "staging",
      vpc_cidr_block: "10.4.0.0/14",
      gcp_project_id: "rair-market-staging",
      region: "us-west1",
      obfuscated_project_id: "5573963367",
      minting_marketplace_subdomain: "new-staging",
      rairnode_subdomain: "new-staging-rairnode"
    },
    "prod": {
      env_name: "prod",
      vpc_cidr_block: "10.8.0.0/14",
      gcp_project_id: "rair-market-production",
      region: "us-west1",
      obfuscated_project_id: "9550688921",
      minting_marketplace_subdomain: "",
      rairnode_subdomain: "rairnode"
    }
  }
}

output "minting_marketplace_managed_cert_name" {
  value = "minting-marketplace"
}

output "minting_marketplace_static_ip_name" {
  value = "minting-network"
}

output "rairnode_managed_cert_name" {
  value = "rairnode"
}

output "rairnode_static_ip_name" {
  value = "rairnode"
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

output "redis_internal_load_balancer_name" {
  value = "redis-internal-load-balancer"
}

output "minting_marketplace_internal_load_balancer_name" {
  value = "minting-marketplace-internal-load-balancer"
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

output "domains" {
  value = {
    rair_market: {
      "base_domain": "rair.market"
    }
  }
}

output "gke_service_accounts" {
  value = {
    rairnode:            "gke-rairnode",
    blockchain_networks: "gke-blockchain-networks",
    jenkins:             "gke-jenkins",
    minting_network:     "gke-minting-network",
    media_service:       "gke-media-service",
  }
}