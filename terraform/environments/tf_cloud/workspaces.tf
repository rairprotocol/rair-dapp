resource "tfe_workspace" "cloudflare" {
  name         = "cloudflare"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "mongo_db_dev" {
  name         = "mongo-db-dev"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "mongo_db_prod" {
  name         = "mongo-db-prod"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "mongo_db_staging" {
  name         = "mongo-db-staging"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "pagerduty" {
  name         = "pagerduty"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "rair_production" {
  name         = "rair-production"
  organization = tfe_organization.rairtech.name
}

resource "tfe_workspace" "rair_staging" {
  name         = "rair-staging"
  organization = tfe_organization.rairtech.name
}

