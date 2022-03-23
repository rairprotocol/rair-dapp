resource "cloudflare_record" "rair_market__coinagenda" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "Coinagenda"
  value   = "95.217.235.127"
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
