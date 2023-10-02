resource "kubernetes_service_account" "each_service_account" {
  for_each = module.shared_config.gke_service_accounts

  metadata {
    name = each.value
    annotations = {
      "iam.gke.io/gcp-service-account" = "${each.value}@${var.gcp_project_id}.iam.gserviceaccount.com"
    }
  }
}