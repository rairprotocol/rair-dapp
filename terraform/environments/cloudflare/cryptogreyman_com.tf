locals {
  cryptogreyman_ttl = 3600
}

resource "cloudflare_record" "cryptogreyman_com__ampersand" {
  zone_id = cloudflare_zone.cryptogreyman_com
  name    = "@"
  value   = "34.149.244.7"
  type    = "A"
  ttl     = local.cryptogreyman_ttl
}

resource "cloudflare_record" "cryptogreyman_com__ampersand_txt" {
  zone_id = cloudflare_zone.cryptogreyman_com
  name    = "@"
  value   = "v=spf1 include:spf.efwd.registrar-servers.com ~all"
  type    = "TXT"
  ttl     = local.cryptogreyman_ttl
}

 