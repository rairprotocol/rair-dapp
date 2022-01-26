resource "google_project_service" "cloud_resource_manager" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_project_service" "container" {
  service = "container.googleapis.com"
}