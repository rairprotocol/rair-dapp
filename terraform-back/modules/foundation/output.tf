output "complete_output" {
  value = {
    static_ips: {
      "gke-nat": google_compute_address.gke_nat.address,
      "primary-ingress": google_compute_address.ip_address.address,
      "jenkins-internal-load-balancer-ip": google_compute_address.jenkins_internal_load_balancer.address,
      "minting-network": google_compute_global_address.minting_network.address,
      "rairnode": google_compute_global_address.rairnode.address
    },
    "vpc_cidr_ranges": module.vpc_cidr_ranges.network_cidr_blocks
  }
}

output "pagerduty_primary_monitoring_notification_name" {
  value = google_monitoring_notification_channel.pagerduty_primary.name
}