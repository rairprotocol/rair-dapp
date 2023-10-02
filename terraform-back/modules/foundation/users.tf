locals {
  users = {
    brian_fogg = {
      email: "brian@rair.tech",
      allowed_IPs_v4: [
          # Carquinez house
          # (added: April 4th, 2022)
          "99.47.22.182"
      ]
    }
  }
}

# adds members to project according to var.account_users array
resource "google_project_iam_member" "project_member" {
  count = length(var.account_users)
  project = var.gcp_project_id
  role    = var.account_users[count.index].role
  member  = "user:${var.account_users[count.index].email}"
}