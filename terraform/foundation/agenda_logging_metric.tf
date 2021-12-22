resource "google_logging_metric" "agenda_action_start_count" {
  name    = "agenda-action-start-count"

  filter = <<EOF
resource.type="k8s_container"
resource.labels.project_id="${data.google_client_config.current.project}"
resource.labels.location="${data.google_container_cluster.dev.location}"
resource.labels.cluster_name="${data.google_container_cluster.dev.name}"
resource.labels.namespace_name="default"
labels.k8s-pod/io_kompose_service="blockchain-event-listener" severity>=DEFAULT
textPayload:"Agenda action started"
EOF

  metric_descriptor {
    metric_kind = "DELTA"
    unit        = "1"
    value_type  = "INT64"
  }
}