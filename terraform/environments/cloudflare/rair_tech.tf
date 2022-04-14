locals {
  rair_tech_base_domain = "rair.tech"
}

###########################################################
###########################################################
###########################################################
###########################################################
# A RECORDS

resource "cloudflare_record" "rair_tech__rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "34.149.48.222"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__demo_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "demo"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__pepe_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "pepe"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__offworld_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "offworld"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__00001_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "00001"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__gunther_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "gunther"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__ed_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "ed"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__swdd_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "swdd"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__deployment1_rair_tech" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "deployment1"
  value   = "162.215.226.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__dev_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dev"
  value   = "35.244.197.92"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__dev2_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dev2"
  value   = "65.21.3.217"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__minter_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "minter"
  value   = "65.21.155.67"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__banqminter_rair_tech" {
  zone_id = cloudflare_zone.rair_market.id
  name    = "banqminter"
  value   = "95.217.235.127"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__qa_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "qa"
  value   = "65.21.191.184"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__jenkins_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "jenkins"
  value   = "34.120.194.63"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__staging_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "staging"
  value   = "34.70.10.28"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__test_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "test"
  value   = "65.21.241.218"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__sundance_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "sundance"
  value   = "34.117.243.198"
  type    = local.record_type.A
}


###########################################################
###########################################################
###########################################################
###########################################################
# MX RECORDS

resource "cloudflare_record" "rair_tech__rair_tech_0" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "aspmx.l.google.com"
  type    = local.record_type.MX
  priority = 1
}

resource "cloudflare_record" "rair_tech__rair_tech_1" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "alt1.aspmx.l.google.com"
  type    = local.record_type.MX
  priority = 5
}

resource "cloudflare_record" "rair_tech__rair_tech_2" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "alt2.aspmx.l.google.com"
  type    = local.record_type.MX
  priority = 5
}

resource "cloudflare_record" "rair_tech__rair_tech_3" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "alt3.aspmx.l.google.com"
  type    = local.record_type.MX
  priority = 10
}

resource "cloudflare_record" "rair_tech__rair_tech_4" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "alt4.aspmx.l.google.com"
  type    = local.record_type.MX
  priority = 10
}

###########################################################
###########################################################
###########################################################
###########################################################
# CNAME RECORDS

resource "cloudflare_record" "rair_tech__imap_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "imap"
  value   = "us2.imap.mailhostbox.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__pop_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "pop"
  value   = "us2.pop.mailhostbox.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__dav_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dav"
  value   = "us2.dav.mailhostbox.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__webmail_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "webmail"
  value   = "us3.webmail.mailhostbox.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__smtp_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "smtp"
  value   = "us2.smtp.mailhostbox.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__8x28r82gszg6hgk4k7px_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "8x28r82gszg6hgk4k7px"
  value   = "verify.squarespace.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__www_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "www"
  value   = "ext-cust.squarespace.com"
  type    = local.record_type.CNAME
}

resource "cloudflare_record" "rair_tech__otfdc2v3j6zt_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "otfdc2v3j6zt"
  value   = "gv-sq5qbjhfmohbrn.dv.googlehosted.com"
  type    = local.record_type.CNAME
}

###########################################################
###########################################################
###########################################################
###########################################################
# TXT RECORDS

resource "cloudflare_record" "rair_tech__rair_tech_txt" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "atlassian-domain-verification=PpZV7awFb2jgoqpJ3rm0PRBaQ22cOfTR1neO/1pSleFSPTLUmAc7iDTYoYz6xi/K"
  type    = local.record_type.TXT
}

resource "cloudflare_record" "rair_tech__1522905413783__domainkey_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "1522905413783._domainkey"
  value   = "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr6KMgdxxgg7oT3ulMwPJs9RXgXDrI9UWU118pHEMohl3UbL3Jwp4oxp/9N3thh/3WCJnYV134zbEVolZwqaT3JsFEq/mQ/RpW/JnOZ3rnxqJPurb2bcfJol4SDxiWVObzHX31xnANzFcXnq1/5dMK5QvW4Jh7n0fm4+4ywqiy2QIDAQAB"
  type    = local.record_type.TXT
}

resource "cloudflare_record" "rair_tech__rair_tech_txt_1" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "v=spf1 include:transmail.net ~all"
  type    = local.record_type.TXT
}

resource "cloudflare_record" "rair_tech__rair_tech_txt_google_site_verification" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = local.rair_tech_base_domain
  value   = "google-site-verification=t9aSZpWxCZBhS3eflPmB1woxbV9zYcahOeFetkjSiiM"
  type    = local.record_type.TXT
}


###########################################################
###########################################################
###########################################################
###########################################################
############################################################
# Internal IP routes

resource "cloudflare_record" "rair_tech__dev_jenkins" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "jenkins.dev"
  value   = "10.0.64.35"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__staging_jenkins" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "jenkins.staging"
  value   = "10.1.64.7"
  type    = local.record_type.A
}

resource "cloudflare_record" "rair_tech__new_dev" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "new.dev"
  value   = "10.0.64.44"
  type    = local.record_type.A
}