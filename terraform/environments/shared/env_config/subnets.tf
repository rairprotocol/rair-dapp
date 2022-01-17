locals {
  cidr_blocks = {
    "dev" = {
      "vpc_cidr_block" = "10.0.0.0/16"
    },
    "staging": {
      "vpc_cidr_block" = "10.1.0.0/16"
    },
    "prod": {
      "vpc_cidr_block" = "10.2.0.0/16"
    }
  }
}