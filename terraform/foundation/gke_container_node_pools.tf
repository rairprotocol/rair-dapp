resource "google_container_node_pool" "cluster_1_default_pool" {
  autoscaling {
    max_node_count = "5"
    min_node_count = "1"
  }

  cluster            = "${google_container_cluster.cluster_1.name}"
  initial_node_count = "3"
  location           = "us-central1-a"

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  name = "default-pool"

  node_config {
    disk_size_gb    = "100"
    disk_type       = "pd-standard"
    image_type      = "COS"
    local_ssd_count = "0"
    machine_type    = "custom-1-3840"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes    = [
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/trace.append",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/compute"
    ]
    preemptible     = "false"
    service_account = "default"

    shielded_instance_config {
      enable_integrity_monitoring = "true"
      enable_secure_boot          = "false"
    }
  }

  node_count     = "3"
  node_locations = ["us-central1-a"]
  project        = "rair-market"

  upgrade_settings {
    max_surge       = "1"
    max_unavailable = "0"
  }

  version = "1.20.10-gke.1600"
}

resource "google_container_node_pool" "dev_default_pool" {
  cluster            = "${google_container_cluster.dev.name}"
  initial_node_count = "3"
  location           = "us-east1-b"

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  max_pods_per_node = "110"
  name              = "default-pool"

  node_config {
    disk_size_gb    = "100"
    disk_type       = "pd-standard"
    image_type      = "COS_CONTAINERD"
    local_ssd_count = "0"
    machine_type    = "e2-medium"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes    = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append"
    ]
    preemptible     = "false"
    service_account = "default"

    shielded_instance_config {
      enable_integrity_monitoring = "true"
      enable_secure_boot          = "false"
    }
  }

  node_count     = "3"
  node_locations = ["us-east1-b"]
  project        = "rair-market"

  upgrade_settings {
    max_surge       = "1"
    max_unavailable = "0"
  }

  version = "1.21.5-gke.1302"
}

resource "google_container_node_pool" "production_default_pool" {
  cluster            = "${google_container_cluster.production.name}"
  initial_node_count = "3"
  location           = "us-west1"

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  max_pods_per_node = "110"
  name              = "default-pool"

  node_config {
    disk_size_gb    = "100"
    disk_type       = "pd-standard"
    image_type      = "COS_CONTAINERD"
    local_ssd_count = "0"
    machine_type    = "e2-medium"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes    = [
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/trace.append",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/servicecontrol"
    ]
    preemptible     = "false"
    service_account = "default"

    shielded_instance_config {
      enable_integrity_monitoring = "true"
      enable_secure_boot          = "false"
    }
  }

  node_count     = "3"
  node_locations = ["us-west1-c", "us-west1-b", "us-west1-a"]
  project        = "rair-market"

  upgrade_settings {
    max_surge       = "1"
    max_unavailable = "0"
  }

  version = "1.21.5-gke.1302"
}

resource "google_container_node_pool" "qa_default_pool" {
  cluster            = "${google_container_cluster.qa.name}"
  initial_node_count = "3"
  location           = "us-west1-a"

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  max_pods_per_node = "110"
  name              = "default-pool"

  node_config {
    disk_size_gb    = "100"
    disk_type       = "pd-standard"
    image_type      = "COS_CONTAINERD"
    local_ssd_count = "0"
    machine_type    = "e2-medium"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes    = [
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/trace.append",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/logging.write"
    ]
    preemptible     = "false"
    service_account = "default"

    shielded_instance_config {
      enable_integrity_monitoring = "true"
      enable_secure_boot          = "false"
    }
  }

  node_count     = "3"
  node_locations = ["us-west1-a"]
  project        = "rair-market"

  upgrade_settings {
    max_surge       = "1"
    max_unavailable = "0"
  }

  version = "1.21.5-gke.1302"
}

resource "google_container_node_pool" "staging_default_pool" {
  cluster            = "${google_container_cluster.staging.name}"
  initial_node_count = "3"
  location           = "southamerica-west1-a"

  management {
    auto_repair  = "true"
    auto_upgrade = "true"
  }

  max_pods_per_node = "110"
  name              = "default-pool"

  node_config {
    disk_size_gb    = "100"
    disk_type       = "pd-standard"
    image_type      = "COS_CONTAINERD"
    local_ssd_count = "0"
    machine_type    = "e2-medium"

    metadata = {
      disable-legacy-endpoints = "true"
    }

    oauth_scopes    = [
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/trace.append"
    ]
    preemptible     = "false"
    service_account = "default"

    shielded_instance_config {
      enable_integrity_monitoring = "true"
      enable_secure_boot          = "false"
    }
  }

  node_count     = "3"
  node_locations = ["southamerica-west1-a"]
  project        = "rair-market"

  upgrade_settings {
    max_surge       = "1"
    max_unavailable = "0"
  }

  version = "1.21.5-gke.1302"
}
