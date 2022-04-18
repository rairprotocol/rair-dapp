variable "project_id" {
  type = string
}

variable "primary_db_name" {
  type = string
}

variable "dev_team_db_admins" {
  type = map(object({
    username: string
  }))

  default = {}
}