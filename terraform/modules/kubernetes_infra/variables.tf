variable "gcp_project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "jenkins_internal_load_balancer_name" {
  type = string
}

variable "rair_internal_load_balancer_name" {
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

variable "minting_marketplace_managed_cert_name" {
  type = string
}

variable "minting_marketplace_static_ip_name" {
  type = string
}