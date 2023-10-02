resource "google_monitoring_uptime_check_config" "rairnode" {
  display_name     = "rairnode-ingress"
  timeout          = "60s"
  period           = "60s"

  http_check {
    path           = "/"
    port           = 443
    use_ssl        = true
    validate_ssl   = true
    request_method = "GET"
  }
  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id: local.gcp_project_id,
      host: module.foundation.managed_cert_domain_names[
        module.config.rairnode_managed_cert_name
      ]
    }
  }
}

resource "google_monitoring_uptime_check_config" "minting_marketplace" {
  display_name     = "minting-marketplace-ingress"
  timeout          = "60s"
  period           = "60s"

  http_check {
    path           = "/"
    port           = 443
    use_ssl        = true
    validate_ssl   = true
    request_method = "GET"
  }
  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id: local.gcp_project_id,
      host: module.foundation.managed_cert_domain_names[
        module.config.minting_marketplace_managed_cert_name
      ]
    }
  }
}