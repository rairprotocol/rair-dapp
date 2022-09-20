module "shared_config" {
  source = "../../environments/shared/env_config"
}

locals {
  latest_git_hash_for_testing_builds = "bf150ce6582bd804f140b0a0f4ff71bd4713e2ce"
}