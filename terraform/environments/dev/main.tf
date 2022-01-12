terraform {
  backend "gcs" {
    bucket  = "foundation-terraform-rair-market-dev"
    prefix  = "terraform/state"
  }
}

variable "gcp_tf_admin_service_account_json" {
  type        = string
  description = "GCP tf-admin authentication file"
}

provider "google" {
  credentials = var.gcp_tf_admin_service_account_json
  project     = "rair-market-dev"
}

module "foundation" {
  source = "../../modules/foundation"

  env_name = "dev"
}