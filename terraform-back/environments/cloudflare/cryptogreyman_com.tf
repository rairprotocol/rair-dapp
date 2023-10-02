resource "cloudflare_record" "cryptogreyman_com__ampersand" {
  zone_id = cloudflare_zone.cryptogreyman_com.id
  name    = "@"
  value   = "34.149.244.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "cryptogreyman_com__ampersand_txt" {
  zone_id = cloudflare_zone.cryptogreyman_com.id
  name    = "@"
  value   = "v=spf1 include:spf.efwd.registrar-servers.com ~all"
  type    = local.record_type.TXT
}