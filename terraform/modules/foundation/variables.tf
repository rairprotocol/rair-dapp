variable "region" {
  type = string
}

variable "env_name" {
  type = string
}

variable "vpc_cidr_block" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "mongo_atlas_org_id" {
  type = string
}

variable "jenkins_internal_load_balancer_name" {
  type = string
}

variable "rair_internal_load_balancer_name" {
  type = string
}

variable "account_users" {
  default = []
  
  type = list(object({
    email: string,
    role: string
  }))
}

variable "secret_adder_role_users" {
  default = []
  type = list(string)
}

variable "obfuscated_project_id" {
  type = string
}

variable "minting_marketplace_managed_cert_name" {
  type = string
}

variable "minting_marketplace_static_ip_name" {
  type = string
}

variable "minting_marketplace_subdomain" {
  type = string
}