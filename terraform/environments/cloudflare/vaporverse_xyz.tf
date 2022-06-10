resource "cloudflare_record" "vaporverse_xyz__vaporverse_xyz" {
  zone_id = cloudflare_zone.vaporverse_xyz.id
  name    = "@"
  value   = "34.145.90.106"
  type    = local.record_type.A
}