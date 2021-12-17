##################################################
# Data source references to existing Kubernetes clusters

data "google_container_cluster" "cluster-1" {
  name     = "cluster-1"
  location = "us-central1-a"
}

data "google_container_cluster" "dev" {
  name     = "dev"
  location = "us-east1-b"
}

data "google_container_cluster" "production" {
  name     = "production"
  location = "us-west1"
}

data "google_container_cluster" "qa" {
  name     = "qa"
  location = "us-west1-a"
}

data "google_container_cluster" "staging" {
  name     = "staging"
  location = "southamerica-west1-a"
}