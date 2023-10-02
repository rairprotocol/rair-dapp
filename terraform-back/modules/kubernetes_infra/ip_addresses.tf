data "google_compute_address" "jenkins_internal_load_balancer" {
  name = module.shared_config.jenkins_internal_load_balancer_name
  project = var.gcp_project_id
  region = var.region
}

data "google_compute_address" "rair_internal_load_balancer" {
  name = module.shared_config.rair_internal_load_balancer_name
  project = var.gcp_project_id
  region = var.region
}

data "google_compute_address" "minting_marketplace_internal_load_balancer" {
  name = module.shared_config.minting_marketplace_internal_load_balancer_name
  project = var.gcp_project_id
  region = var.region
}

data "google_compute_address" "redis_internal_load_balancer" {
  name    = module.shared_config.redis_internal_load_balancer_name
  project = var.gcp_project_id
  region  = var.region
}
