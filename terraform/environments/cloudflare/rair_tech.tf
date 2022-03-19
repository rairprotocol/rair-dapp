locals {
  rair_tech_ttl = 3600
}

##########################################
##########################################
# A RECORDS

resource "cloudflare_record" "rair_tech__rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "34.149.48.222"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__demo_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "demo.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__pepe_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "pepe.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__offworld_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "offworld.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__00001_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "00001.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__gunther_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "gunther.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__ed_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "ed.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__swdd_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "swdd.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__deployment1_rair_tech" {
  zone_id = cloudflare_zone.rair_market.rair_tech
  name    = "deployment1.rair.tech"
  value   = "162.215.226.7"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__dev_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dev.rair.tech"
  value   = "35.244.197.92"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__dev2_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dev2.rair.tech"
  value   = "65.21.3.217"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__minter_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "minter.rair.tech"
  value   = "65.21.155.67"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__banqminter_rair_tech" {
  zone_id = cloudflare_zone.rair_market.rair_tech
  name    = "banqminter.rair.tech"
  value   = "95.217.235.127"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__qa_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "qa.rair.tech"
  value   = "65.21.191.184"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__jenkins_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "jenkins.rair.tech"
  value   = "34.120.194.63"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__staging_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "staging.rair.tech"
  value   = "34.70.10.28"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__test_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "test.rair.tech"
  value   = "65.21.241.218"
  type    = "A"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__sundance_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "sundance.rair.tech"
  value   = "34.117.243.198"
  type    = "A"
  ttl     = local.rair_tech_ttl
}


##########################################
##########################################
# MX RECORDS

resource "cloudflare_record" "rair_tech__rair_tech_0" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "aspmx.l.google.com"
  type    = "MX"
  ttl     = local.rair_tech_ttl
  priority = 1
}

resource "cloudflare_record" "rair_tech__rair_tech_1" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "alt1.aspmx.l.google.com"
  type    = "MX"
  ttl     = local.rair_tech_ttl
  priority = 5
}

resource "cloudflare_record" "rair_tech__rair_tech_2" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "alt2.aspmx.l.google.com"
  type    = "MX"
  ttl     = local.rair_tech_ttl
  priority = 5
}

resource "cloudflare_record" "rair_tech__rair_tech_3" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "alt3.aspmx.l.google.com"
  type    = "MX"
  ttl     = local.rair_tech_ttl
  priority = 10
}

resource "cloudflare_record" "rair_tech__rair_tech_4" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "alt4.aspmx.l.google.com"
  type    = "MX"
  ttl     = local.rair_tech_ttl
  priority = 10
}

##########################################
##########################################
# CNAME RECORDS

resource "cloudflare_record" "rair_tech__imap_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "imap.rair.tech"
  value   = "us2.imap.mailhostbox.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__pop_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "pop.rair.tech"
  value   = "us2.pop.mailhostbox.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__dav_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "dav.rair.tech"
  value   = "us2.dav.mailhostbox.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__webmail_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "webmail.rair.tech"
  value   = "us3.webmail.mailhostbox.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__smtp_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "smtp.rair.tech"
  value   = "us2.smtp.mailhostbox.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__8x28r82gszg6hgk4k7px_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "8x28r82gszg6hgk4k7px.rair.tech"
  value   = "verify.squarespace.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__www_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "www.rair.tech"
  value   = "ext-cust.squarespace.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

resource "cloudflare_record" "rair_tech__otfdc2v3j6zt_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "otfdc2v3j6zt.rair.tech"
  value   = "gv-sq5qbjhfmohbrn.dv.googlehosted.com"
  type    = "CNAME"
  ttl     = local.rair_tech_ttl
}

##########################################
##########################################
# TXT RECORDS

resource "cloudflare_record" "rair_tech__rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "atlassian-domain-verification=PpZV7awFb2jgoqpJ3rm0PRBaQ22cOfTR1neO/1pSleFSPTLUmAc7iDTYoYz6xi/K"
  type    = "TXT"
}

resource "cloudflare_record" "rair_tech__1522905413783__domainkey_rair_tech" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "1522905413783._domainkey.rair.tech"
  value   = "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr6KMgdxxgg7oT3ulMwPJs9RXgXDrI9UWU118pHEMohl3UbL3Jwp4oxp/9N3thh/3WCJnYV134zbEVolZwqaT3JsFEq/mQ/RpW/JnOZ3rnxqJPurb2bcfJol4SDxiWVObzHX31xnANzFcXnq1/5dMK5QvW4Jh7n0fm4+4ywqiy2QIDAQAB"
  type    = "TXT"
}

resource "cloudflare_record" "rair_tech__rair_tech_txt_1" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "v=spf1 include:transmail.net ~all"
  type    = "TXT"
}

resource "cloudflare_record" "rair_tech__rair_tech_txt_2" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = ""
  type    = "TXT"
}

resource "cloudflare_record" "rair_tech__rair_tech_txt_2" {
  zone_id = cloudflare_zone.rair_tech.id
  name    = "rair.tech"
  value   = "google-site-verification=t9aSZpWxCZBhS3eflPmB1woxbV9zYcahOeFetkjSiiM"
  type    = "TXT"
}
