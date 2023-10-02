
resource "google_monitoring_alert_policy" "rairnode_uptime" {
  display_name          = var.display_name

  enabled               = true
  combiner              = "OR"
  notification_channels = var.notification_channels


  alert_strategy {
    auto_close          = "604800s"
  }

  conditions {
    display_name = "Uptime Check on ${var.uptime_check_name}"

    condition_threshold {
      filter                 = "resource.type = \"uptime_url\" AND metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.labels.check_id = \"${var.uptime_check_id}\""
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