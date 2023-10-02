resource "cloudflare_record" "taxhacks_xyz__taxhacks_xyz" {
  zone_id = cloudflare_zone.taxhacks_xyz.id
  name    = "@"
  value   = "34.95.110.112"
  type    = local.record_type.A
}