resource "cloudflare_record" "ukraineglitch_com__ukraineglitch_com" {
  zone_id = cloudflare_zone.ukraineglitch_com.id
  name    = "@"
  value   = "35.227.202.184"
  type    = local.record_type.A
}