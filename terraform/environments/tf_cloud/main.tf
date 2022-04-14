terraform {
  required_providers {
    tfe = {
      source = "hashicorp/tfe"
      version = "0.30.2"
    }
  }
}

provider "tfe" {}