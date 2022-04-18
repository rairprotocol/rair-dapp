locals {
  mongo_db_description = "Managing hosted MongoDB for %s environment"
  foundation_description = "Terraform run for Foundation GCP environment: %s"
  default_vcs_branch = "dev"
}

resource "tfe_workspace" "cloudflare" {
  name         = "cloudflare"
  description = "Adminster Cloudflare DNS and proxy rules for all environments"
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/cloudflare"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true

  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id = "ot-pmtxUjKskMf1r9wQ"
  }
}

resource "tfe_workspace" "mongo_db_prod" {
  name         = "mongo-db-prod"
  description = format(local.mongo_db_description, "PROD")
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/prod/mongo_db"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true


  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id = "ot-pmtxUjKskMf1r9wQ"
  }
}

resource "tfe_workspace" "mongo_db_staging" {
  name         = "mongo-db-staging"
  description = format(local.mongo_db_description, "STAGING")
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/staging/mongo_db"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true


  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id = "ot-pmtxUjKskMf1r9wQ"
  }
}

resource "tfe_workspace" "pagerduty" {
  name         = "pagerduty"
  description = "Administer Pagerduty oncall schedules, teams, users, etc."
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/pagerduty"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true


  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id = "ot-pmtxUjKskMf1r9wQ"
  }
}

resource "tfe_workspace" "rair_production" {
  name         = "rair-production"
  description = format(local.foundation_description, "PROD")
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/prod/foundation"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true


  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id = "ot-pmtxUjKskMf1r9wQ"
  }
}

resource "tfe_workspace" "rair_staging" {
  name         = "rair-staging"
  description = format(local.foundation_description, "STAGING")
  organization = tfe_organization.rairtech.name
  auto_apply = false
  allow_destroy_plan = false
  working_directory = "terraform/environments/staging/foundation"
  queue_all_runs = false
  speculative_enabled = true
  structured_run_output_enabled = true


  # VCS repo data is entered into the web UI first
  # then the identifier and oath_token_id are pulled from the
  # proposed changes in tf plan and pasted here
  vcs_repo {
    identifier = "%7Bf5368d7b-2fae-49fe-bbf0-6e342bd034c9%7D/%7Ba23789fe-787d-42a1-8c68-0098270f2999%7D"
    branch = local.default_vcs_branch
    ingress_submodules = false
    oauth_token_id     = "ot-pmtxUjKskMf1r9wQ"
  }
}