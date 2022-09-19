
module "rairnode_uptime_alert_policy" {
  source = "../../../modules/uptime_check_alert_policy"
  
  notification_channels = [
    module.foundation.pagerduty_primary_monitoring_notification_name
  ]
  uptime_check_name = google_monitoring_uptime_check_config.rairnode.name
}

resource "google_monitoring_alert_policy" "rairnode_uptime" {
  display_name          = "Rairnode Uptime"

  enabled               = true
  combiner              = "OR"
  notification_channels = [
    module.foundation.pagerduty_primary_monitoring_notification_name,
  ]

  alert_strategy {
    auto_close          = "604800s"
  }

  conditions {
    display_name = "Uptime Check on ${google_monitoring_uptime_check_config.rairnode.name}"

    condition_threshold {
      filter                 = "resource.type = \"uptime_url\" AND metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.labels.check_id = \"${google_monitoring_uptime_check_config.rairnode.name}\""
      duration               = "0s"
      comparison             = "COMPARISON_GT"

      trigger {
        count                = 1
      }

      threshold_value        = 1

      aggregations {
        alignment_period     = "1200s"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        group_by_fields      = [
          "resource.label.project_id",
          "resource.label.host"
        ]
      }

    }
  }
}