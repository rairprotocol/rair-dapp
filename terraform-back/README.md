# Terraform

## Installing Terraform
`brew install tfenv`
`tfenv install 1.1.1`
`tfenv use 1.1.1`

### Authorization
Auth `gcloud` CLI using web interface
`gcloud auth application-default login`

### Usage
- `terraform init`
Downloads dependencies and initializes environment

- `terraform plan`
View proposed changes

- `terraform apply`
Apply changes

### TF Runtimes
- foundation: Networking, Kubernetes clusters and other core infra
- kubernetes-config: tbd