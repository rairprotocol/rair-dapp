resource "tfe_organization_membership" "brian" {
  organization = tfe_organization.rairtech.name
  email = "brian@rair.tech"
}

resource "tfe_organization_membership" "chris" {
  organization = tfe_organization.rairtech.name
  email = "chris@rair.tech"
}

resource "tfe_organization_membership" "garrett" {
  organization = tfe_organization.rairtech.name
  email = "garrett@rair.tech"
}

resource "tfe_organization_membership" "zeph" {
  organization = tfe_organization.rairtech.name
  email = "zeph@rair.tech"
}