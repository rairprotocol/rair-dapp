resource "google_storage_bucket" "mongo_dev_tf_storage" {
  name          = "${module.config.env_config.dev.gcp_project_id}-mongo-dev-tf-state"
  location      = module.config.env_config.dev.region
  project       = module.config.env_config.dev.gcp_project_id
  storage_class = "STANDARD"
}