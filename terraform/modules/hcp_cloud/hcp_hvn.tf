
resource "hcp_hvn" "primary" {
  hvn_id         = "primary-hvn-${var.env_name}"
  cloud_provider = "aws"
  region         = "us-west-2"
  
  # We're not specifying a cidr_block here
  # because we're not going to be using network peering
  # so the private IP's don't matter in this case
  # Once HCP offers GCP hosted Vault, we can re-create these networks
  # using the GCP provider and specify cidr ranges that work for us
}