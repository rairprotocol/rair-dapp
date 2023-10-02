locals {
  # If the subdomain is set to empty string, don't render the period
  minting_marketplace_cert_domain_period_or_not = var.minting_marketplace_subdomain == "" ? "" : "."
  rairnode_cert_domain_period_or_not            = var.rairnode_subdomain == "" ? "" : "."

  miting_marketplace_formatted_domain = "${var.minting_marketplace_subdomain}${local.minting_marketplace_cert_domain_period_or_not}${module.shared_config.domains.rair_market.base_domain}"
  rairnode_formatted_domain = "${var.rairnode_subdomain}${local.rairnode_cert_domain_period_or_not}${module.shared_config.domains.rair_market.base_domain}"
}

resource "google_compute_managed_ssl_certificate" "minting_marketplace" {
  name = module.shared_config.minting_marketplace_managed_cert_name
  managed {
    domains = [local.miting_marketplace_formatted_domain]
  }
}

resource "google_compute_managed_ssl_certificate" "rairnode" {
  name = module.shared_config.rairnode_managed_cert_name
  managed {
    domains = [
      local.rairnode_formatted_domain
    ]
  }
}

output "managed_cert_domain_names" {
  value = {
    (module.shared_config.minting_marketplace_managed_cert_name) = local.miting_marketplace_formatted_domain,
    (module.shared_config.rairnode_managed_cert_name)            = local.rairnode_formatted_domain
  }
}