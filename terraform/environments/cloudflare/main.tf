terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

provider "cloudflare" {
  email   = ""
  api_key = ""
}

resource "cloudflare_zone" "rair-tech" {
    zone = "rair.tech"
}