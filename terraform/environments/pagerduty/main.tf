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

module "dev" {
  source            = "./each_env"
  name              = "Dev"
  escalation_policy = pagerduty_escalation_policy.devops.id
}

module "staging" {
  source            = "./each_env"
  name              = "Staging"
  escalation_policy = pagerduty_escalation_policy.devops.id
}

module "prod" {
  source            = "./each_env"
  name              = "Prod"
  escalation_policy = pagerduty_escalation_policy.devops.id
}