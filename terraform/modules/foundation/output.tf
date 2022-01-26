output "vpc_cidr_range_output" {
  value = {
    "vpc_cidr_ranges": module.vpc_cidr_ranges.network_cidr_blocks
  }
}