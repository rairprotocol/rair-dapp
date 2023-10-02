resource "google_monitoring_notification_channel" "pagerduty_primary" {
  display_name  = "Pagerduty Integration"
  type          = "pagerduty"
  description   = "Pagerduty Integration"

  sensitive_labels {
    # Do not edit this in TF
    # It's only here as a placeholder
    service_key = "manually_replace_after_applying_tf"
  }
}
