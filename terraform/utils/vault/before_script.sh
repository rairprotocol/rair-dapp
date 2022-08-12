#!/bin/bash

echo "Enter Vault token:"
read -s VAULT_TOKEN_INPUT
export VAULT_TOKEN=$VAULT_TOKEN_INPUT

export VAULT_FORMAT="json"
export VAULT_NAMESPACE="admin"

# Dev
# export VAULT_ADDR="https://primary-dev.vault.9871e6c3-b0b9-479a-b392-eb69322d192a.aws.hashicorp.cloud:8200"

# Staging
export VAULT_ADDR="https://primary-staging-public-vault-f709a5a3.9b077395.z1.hashicorp.cloud:8200"

# Prod
# export VAULT_ADDR="https://primary-prod-public-vault-19edc454.66c70199.z1.hashicorp.cloud:8200"