terraform {
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

module "kubernetes_infra" {
  source = "../../../modules/kubernetes_infra"
}