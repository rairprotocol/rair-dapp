variable "secret_name" {
  type = string
}

variable "service_account_emails_to_grant_secret_accessor" {
  type = list(string)
}