terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "cloudflare"
    }
  }
}

provider "cloudflare" {}

locals {
  record_type = {
    A: "A",
    CNAME: "CNAME",
    MX: "MX",
    TXT: "TXT"
  }
}