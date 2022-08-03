terraform {
  backend "gcs" {
    bucket  = "rair-market-dev-kubernetes-tf-state"
    prefix  = "terraform/state"
  }
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.9.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

module "config" {
  source = "../../shared/env_config"
}

locals {
  gcp_project_id = "rair-market-dev"
}

module "kubernetes_infra" {
  source                                   = "../../../modules/kubernetes_infra"
  gcp_project_id                           = local.gcp_project_id
  region                                   = "us-west1"
  rairnode_configmap_data                  = local.rairnode_configmap
  minting_network_configmap_data           = local.minting_network_configmap
  blockchain_event_listener_configmap_data = local.blockchain_event_listener_configmap
  media_service_configmap_data             = local. media_service_configmap
  pull_secret_name                         = "regcred"
}