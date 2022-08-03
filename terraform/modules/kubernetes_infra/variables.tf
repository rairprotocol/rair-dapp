variable "gcp_project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "rairnode_configmap_data" {
  type = map(string)
}

variable "minting_network_configmap_data" {
  type = map(string)
}

variable "blockchain_event_listener_configmap_data" {
  type = map(string)
}

variable "media_service_configmap_data" {
  type = map(string)
}

variable "pull_secret_name" {
  type = string
}