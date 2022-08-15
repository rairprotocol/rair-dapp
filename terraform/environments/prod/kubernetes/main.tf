terraform {
  backend "gcs" {
    bucket  = "rair-market-production-kubernetes-tf-state"
    prefix  = "terraform/state"
  }
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.9.0"
    }
  }
}

locals {
  gcp_project_id                           = "rair-market-production"
}

module "gke_auth" {
  source               = "terraform-google-modules/kubernetes-engine/google//modules/auth"

  project_id           = local.gcp_project_id
  cluster_name         = "primary"
  location             = "us-west1-a"
  use_private_endpoint = true
}

provider "kubernetes" {
  cluster_ca_certificate = module.gke_auth.cluster_ca_certificate
  host                   = module.gke_auth.host
  token                  = module.gke_auth.token
}

module "config" {
  source = "../../shared/env_config"
}

module "kubernetes_infra" {
  source                                   = "../../../modules/kubernetes_infra"
  gcp_project_id                           = local.gcp_project_id
  region                                   = "us-west1"
  rairnode_configmap_data                  = local.rairnode_configmap
  minting_network_configmap_data           = local.minting_network_configmap
  blockchain_event_listener_configmap_data = local.blockchain_event_listener_configmap
  media_service_configmap_data             = {}
  pull_secret_name                         = "regcred"
}