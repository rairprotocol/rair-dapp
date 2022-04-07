output "complete_output" {
  value = {
    static_ips: {
      "gke-nat": google_compute_address.gke_nat.address,
      "primary-ingress": google_compute_address.ip_address.address,
      "jenkins-internal-load-balancer-ip": google_compute_address.jenkins_internal_load_balancer.address
    },
    "vpc_cidr_ranges": module.vpc_cidr_ranges.network_cidr_blocks
  }
}