
module "rairnode_uptime_alert_policy" {
  source = "../../../modules/uptime_check_alert_policy"
  
  display_name = "Rairnode Uptime"
  notification_channels = [
    module.foundation.pagerduty_primary_monitoring_notification_name
  ]
  uptime_check_name = google_monitoring_uptime_check_config.rairnode.name
  uptime_check_id   = google_monitoring_uptime_check_config.rairnode.uptime_check_id
}

module "minting_marketplace_uptime_alert_policy" {
  source = "../../../modules/uptime_check_alert_policy"
  
  display_name = "Minting Marketplace Uptime"
  notification_channels = [
    module.foundation.pagerduty_primary_monitoring_notification_name
  ]
  uptime_check_name = google_monitoring_uptime_check_config.minting_marketplace.name
  uptime_check_id   = google_monitoring_uptime_check_config.minting_marketplace.uptime_check_id
}