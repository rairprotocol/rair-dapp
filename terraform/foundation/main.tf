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

module "hello_world" {
  source = "./hello_world"
  name = "rair-market-hello-world"
}