locals {
  # If the subdomain is set to empty string, don't render the period
  minting_marketplace_cert_domain_period_or_not = var.minting_marketplace_subdomain == "" ? "" : "."
  rairnode_cert_domain_period_or_not            = var.rairnode_subdomain == "" ? "" : "."
}

resource "google_compute_managed_ssl_certificate" "minting_marketplace" {
  name = module.shared_config.minting_marketplace_managed_cert_name
  managed {
    domains = ["${var.minting_marketplace_subdomain}${local.minting_marketplace_cert_domain_period_or_not}${module.shared_config.domains.rair_market.base_domain}"]
  }
}

resource "google_compute_managed_ssl_certificate" "rairnode" {
  name = module.shared_config.rairnode_managed_cert_name
  managed {
    domains = ["${var.rairnode_subdomain}${local.rairnode_cert_domain_period_or_not}${module.shared_config.domains.rair_market.base_domain}"]
  }
}