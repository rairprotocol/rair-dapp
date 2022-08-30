resource "cloudflare_record" "rair_market__coinagenda" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Coinagenda"
  value   = "35.190.73.218"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market__demo" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Demo"
  value   = "34.120.49.144"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market__iverse" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Iverse"
  value   = "34.111.142.112"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market__nipsey" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Nipsey"
  value   = "34.95.69.25"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market_txt_1" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "@"
  value   = "v=spf1 include:transmail.net ~all"
  type    = local.record_type.TXT
}

resource "cloudflare_record" "rair_market__nftla_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Nftla"
  value   = "34.111.149.83"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market__staging_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Staging"
  value   = "35.227.249.6"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_market__nftnyc_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Nftnyc"
  value   = "34.98.108.170"
  type    = local.record_type.A
}

resource "cloudflare_record" "dev_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.dev.minting_marketplace_frontend_subdomain
  value   = "34.160.12.217"
  type    = local.record_type.A
}


#######################################################
# Start: Rairnode API endpoint
resource "cloudflare_record" "staging_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.staging.rairnode_subdomain
  value   = "10.4.64.2"
  type    = local.record_type.A
}

resource "cloudflare_record" "prod_rair_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "@"
  value   = "34.160.73.41"
  type    = local.record_type.A
}

resource "cloudflare_record" "dev_rairnode_market" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.dev.rairnode_subdomain
  value   = "10.0.64.44"
  type    = local.record_type.A
}
# End: Rairnode API endpoint
#######################################################


#######################################################
# Start: Minting marketplace frontend public ingress to GKE
resource "cloudflare_record" "minting_marketplace_frontend_dev" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.dev.minting_marketplace_frontend_subdomain
  value   = "10.0.64.104"
  type    = local.record_type.A
}
resource "cloudflare_record" "minting_marketplace_frontend_staging" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.staging.minting_marketplace_frontend_subdomain
  value   = "10.4.64.9"
  type    = local.record_type.A
}
resource "cloudflare_record" "minting_marketplace_frontend_prod" {
  zone_id = cloudflare_zone.rair_market.id
  name    = module.shared_config.env_config.prod.minting_marketplace_frontend_subdomain
  value   = "34.160.73.41"
  type    = local.record_type.A
}
# END: Minting marketplace frontend public ingress to GKE
#######################################################