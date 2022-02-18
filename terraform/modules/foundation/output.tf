output "complete_output" {
  value = {
    static_ips: {
      "gke-nat": google_compute_address.gke_nat.address,
      "primary-ingress": google_compute_address.ip_address.address
    },
    "vpc_cidr_ranges": module.vpc_cidr_ranges.network_cidr_blocks
  }
}