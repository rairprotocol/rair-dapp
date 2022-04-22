locals {
  rair_tech_email_domain = "rair.tech"
}

data "pagerduty_user" "chris_rose" {
  email = "chris@${local.rair_tech_email_domain}"
}

data "pagerduty_user" "garrett_minks" {
  email = "garrett@${local.rair_tech_email_domain}"
}

data "pagerduty_user" "brian_fogg" {
  email = "brian@${local.rair_tech_email_domain}"
}

data "pagerduty_user" "zeph_alcala" {
  email = "zeph@${local.rair_tech_email_domain}"
}