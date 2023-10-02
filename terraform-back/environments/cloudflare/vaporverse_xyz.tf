resource "cloudflare_record" "vaporverse_xyz__vaporverse_xyz" {
  zone_id = cloudflare_zone.vaporverse_xyz.id
  name    = "@"
  value   = "34.117.79.144"
  type    = local.record_type.A
}