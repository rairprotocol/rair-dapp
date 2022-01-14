terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "pagerduty"
    }
  }
}

variable "pagerduty_api_key" {
  type = string
}

local {
  tf_admin_postfix = "(TF Administered)"
}

resource "pagerduty_service" "dev" {
  name                    = "Dev ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.engineering.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "staging" {
  name                    = "Staging ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.engineering.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "qa" {
  name                    = "QA ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.engineering.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "prod" {
  name                    = "Prod ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.engineering.id
  alert_creation          = "create_alerts_and_incidents"
}