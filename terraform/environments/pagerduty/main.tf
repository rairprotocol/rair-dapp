terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "rairtech"
    workspaces {
      name = "pagerduty"
    }
  }
  required_providers {
    pagerduty = {
      source = "PagerDuty/pagerduty"
      version = "2.4.0"
    }
  }
}

variable "pagerduty_api_key" {
  type = string
}

provider "pagerduty" {
    token = var.pagerduty_api_key
}

locals {
  tf_admin_postfix = "(TF Administered)"
}

resource "pagerduty_service" "dev" {
  name                    = "Dev ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.devops.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "staging" {
  name                    = "Staging ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.devops.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "qa" {
  name                    = "QA ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.devops.id
  alert_creation          = "create_alerts_and_incidents"
}

resource "pagerduty_service" "prod" {
  name                    = "Prod ${local.tf_admin_postfix}"
  escalation_policy       = pagerduty_escalation_policy.devops.id
  alert_creation          = "create_alerts_and_incidents"
}