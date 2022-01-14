terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.4.0"
    }
  }
  backend "gcs" {
    bucket  = "rair-market-foundation-terraform"
    prefix  = "terraform/state"
  }
  required_version = "~> 1.1.1"
}

provider "google" {
  project     = "rair-market"
}

data "google_project" "project" {}
data "google_client_config" "current" {}

module "hello_world" {
  source = "./hello_world"
  name = "rair-market-hello-world"
}