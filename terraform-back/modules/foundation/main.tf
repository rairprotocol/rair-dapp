locals {
  avaliablity_zones = {
    a = "${var.region}-a",
    b = "${var.region}-b",
    c = "${var.region}-c"
  }
}

module "shared_config" {
  source = "../../environments/shared/env_config"
}

resource "google_compute_resource_policy" "daily_backup" {
  name   = "every-day-4am"
  region = "us-central1"
  snapshot_schedule_policy {
    schedule {
      daily_schedule {
        days_in_cycle = 1
        start_time    = "04:00"
      }
    }
  }
}