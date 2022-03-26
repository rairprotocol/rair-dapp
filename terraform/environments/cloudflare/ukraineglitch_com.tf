resource "cloudflare_record" "ukraineglitch_com__ukraineglitch_com" {
  zone_id = cloudflare_zone.ukraineglitch_com.id
  name    = local.ukraineglitch_com_base_domain
  value   = "35.227.202.184"
  type    = local.record_type.A
}