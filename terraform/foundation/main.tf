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
}

provider "google" {
  project     = "rair-market"
}