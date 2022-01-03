resource "google_container_cluster" "cluster_1" {
  addons_config {
    http_load_balancing {
      disabled = "false"
    }

    network_policy_config {
      disabled = "true"
    }
  }

  cluster_autoscaling {
    enabled = "false"
  }

  database_encryption {
    state = "DECRYPTED"
  }

  enable_binary_authorization = "false"
  enable_intranode_visibility = "false"
  enable_kubernetes_alpha     = "false"
  enable_legacy_abac          = "false"
  enable_shielded_nodes       = "true"
  enable_tpu                  = "false"
  initial_node_count          = "0"
  location                    = "us-central1-a"

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_service = "logging.googleapis.com/kubernetes"

  master_auth {
    client_certificate_config {
      issue_client_certificate = "false"
    }
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  name               = "cluster-1"
  network            = "projects/rair-market/global/networks/default"

  network_policy {
    enabled  = "false"
    provider = "PROVIDER_UNSPECIFIED"
  }

  networking_mode = "ROUTES"
  node_version    = "1.20.10-gke.1600"
  project         = "rair-market"

  release_channel {
    channel = "STABLE"
  }

  subnetwork = "projects/rair-market/regions/us-central1/subnetworks/default"
}

resource "google_container_cluster" "dev" {
  addons_config {
    horizontal_pod_autoscaling {
      disabled = "false"
    }

    http_load_balancing {
      disabled = "false"
    }

    network_policy_config {
      disabled = "true"
    }
  }

  cluster_autoscaling {
    auto_provisioning_defaults {
      oauth_scopes    = ["https://www.googleapis.com/auth/logging.write", "https://www.googleapis.com/auth/monitoring"]
      service_account = "default"
    }

    enabled = "true"

    resource_limits {
      maximum       = "1"
      minimum       = "1"
      resource_type = "cpu"
    }

    resource_limits {
      maximum       = "1"
      minimum       = "1"
      resource_type = "memory"
    }
  }

  database_encryption {
    state = "DECRYPTED"
  }

  datapath_provider         = "LEGACY_DATAPATH"
  default_max_pods_per_node = "110"

  default_snat_status {
    disabled = "false"
  }

  enable_binary_authorization = "false"
  enable_intranode_visibility = "false"
  enable_kubernetes_alpha     = "false"
  enable_legacy_abac          = "false"
  enable_shielded_nodes       = "true"
  enable_tpu                  = "false"
  initial_node_count          = "0"

  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.20.0.0/14"
    services_ipv4_cidr_block = "10.24.0.0/20"
  }

  location = "us-east1-b"

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_service = "logging.googleapis.com/kubernetes"

  master_auth {
    client_certificate_config {
      issue_client_certificate = "false"
    }
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  name               = "dev"
  network            = "projects/rair-market/global/networks/default"

  network_policy {
    enabled  = "false"
    provider = "PROVIDER_UNSPECIFIED"
  }

  networking_mode = "VPC_NATIVE"
  node_version    = "1.21.5-gke.1302"
  project         = "rair-market"

  release_channel {
    channel = "REGULAR"
  }

  subnetwork = "projects/rair-market/regions/us-east1/subnetworks/default"
}

resource "google_container_cluster" "production" {
  addons_config {
    horizontal_pod_autoscaling {
      disabled = "false"
    }

    http_load_balancing {
      disabled = "false"
    }

    network_policy_config {
      disabled = "true"
    }
  }

  cluster_autoscaling {
    enabled = "false"
  }

  database_encryption {
    state = "DECRYPTED"
  }

  datapath_provider         = "LEGACY_DATAPATH"
  default_max_pods_per_node = "110"

  default_snat_status {
    disabled = "false"
  }

  enable_binary_authorization = "false"
  enable_intranode_visibility = "false"
  enable_kubernetes_alpha     = "false"
  enable_legacy_abac          = "false"
  enable_shielded_nodes       = "true"
  enable_tpu                  = "false"
  initial_node_count          = "0"

  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.4.0.0/14"
    services_ipv4_cidr_block = "10.8.0.0/20"
  }

  location = "us-west1"

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_service = "logging.googleapis.com/kubernetes"

  master_auth {
    client_certificate_config {
      issue_client_certificate = "false"
    }
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  name               = "production"
  network            = "projects/rair-market/global/networks/default"

  network_policy {
    enabled  = "false"
    provider = "PROVIDER_UNSPECIFIED"
  }

  networking_mode = "VPC_NATIVE"
  node_locations  = ["us-west1-a", "us-west1-c", "us-west1-b"]
  node_version    = "1.21.5-gke.1302"
  project         = "rair-market"

  release_channel {
    channel = "REGULAR"
  }

  subnetwork = "projects/rair-market/regions/us-west1/subnetworks/default"
}

resource "google_container_cluster" "qa" {
  addons_config {
    horizontal_pod_autoscaling {
      disabled = "false"
    }

    http_load_balancing {
      disabled = "false"
    }

    network_policy_config {
      disabled = "true"
    }
  }

  cluster_autoscaling {
    enabled = "false"
  }

  database_encryption {
    state = "DECRYPTED"
  }

  datapath_provider         = "LEGACY_DATAPATH"
  default_max_pods_per_node = "110"

  default_snat_status {
    disabled = "false"
  }

  enable_binary_authorization = "false"
  enable_intranode_visibility = "false"
  enable_kubernetes_alpha     = "false"
  enable_legacy_abac          = "false"
  enable_shielded_nodes       = "true"
  enable_tpu                  = "false"
  initial_node_count          = "0"

  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.96.0.0/14"
    services_ipv4_cidr_block = "10.100.0.0/20"
  }

  location = "us-west1-a"

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_service = "logging.googleapis.com/kubernetes"

  master_auth {
    client_certificate_config {
      issue_client_certificate = "false"
    }
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  name               = "qa"
  network            = "projects/rair-market/global/networks/default"

  network_policy {
    enabled  = "false"
    provider = "PROVIDER_UNSPECIFIED"
  }

  networking_mode = "VPC_NATIVE"
  node_version    = "1.21.5-gke.1302"
  project         = "rair-market"

  release_channel {
    channel = "REGULAR"
  }

  subnetwork = "projects/rair-market/regions/us-west1/subnetworks/default"
}

resource "google_container_cluster" "staging" {
  addons_config {
    horizontal_pod_autoscaling {
      disabled = "false"
    }

    http_load_balancing {
      disabled = "false"
    }

    network_policy_config {
      disabled = "true"
    }
  }

  cluster_autoscaling {
    enabled = "false"
  }

  database_encryption {
    state = "DECRYPTED"
  }

  datapath_provider         = "LEGACY_DATAPATH"
  default_max_pods_per_node = "110"

  default_snat_status {
    disabled = "false"
  }

  enable_binary_authorization = "false"
  enable_intranode_visibility = "false"
  enable_kubernetes_alpha     = "false"
  enable_legacy_abac          = "false"
  enable_shielded_nodes       = "true"
  enable_tpu                  = "false"
  initial_node_count          = "0"

  ip_allocation_policy {
    cluster_ipv4_cidr_block  = "10.12.0.0/14"
    services_ipv4_cidr_block = "10.16.0.0/20"
  }

  location = "southamerica-west1-a"

  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  logging_service = "logging.googleapis.com/kubernetes"

  master_auth {
    client_certificate_config {
      issue_client_certificate = "false"
    }
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  name               = "staging"
  network            = "projects/rair-market/global/networks/default"

  network_policy {
    enabled  = "false"
    provider = "PROVIDER_UNSPECIFIED"
  }

  networking_mode = "VPC_NATIVE"
  node_version    = "1.21.5-gke.1302"
  project         = "rair-market"

  release_channel {
    channel = "REGULAR"
  }

  subnetwork = "projects/rair-market/regions/southamerica-west1/subnetworks/default"
}
