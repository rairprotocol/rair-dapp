output "env_config" {

  value = {
    "dev" = {
      "vpc_cidr_block" = local.cidr_blocks.dev.vpc_cidr_block
    },
    "staging": {
      "vpc_cidr_block" = local.cidr_blocks.staging.vpc_cidr_block
    },
    "prod": {
      "vpc_cidr_block" = local.cidr_blocks.prod.vpc_cidr_block
    }
  }
}