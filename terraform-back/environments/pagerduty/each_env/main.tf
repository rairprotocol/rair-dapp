terraform {
  required_providers {
    pagerduty = {
      source = "PagerDuty/pagerduty"
      version = "2.4.0"
    }
  }
}

locals {
  tf_admin_postfix = "(TF Administered)"
}

resource "pagerduty_service" "service" {
  name                    = "${var.name} ${local.tf_admin_postfix}"
  escalation_policy       = var.escalation_policy
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service_integration" "integration" {
  name    = "generic-api-integration"
  type    = "generic_events_api_inbound_integration"
  service = pagerduty_service.service.id
}