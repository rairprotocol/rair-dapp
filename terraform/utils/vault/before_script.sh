#!/bin/bash

echo "Enter Vault token:"
read -s VAULT_TOKEN_INPUT
export VAULT_TOKEN=$VAULT_TOKEN_INPUT

export VAULT_FORMAT="json"
export VAULT_NAMESPACE="admin"
export VAULT_ADDR="https://primary-dev.vault.9871e6c3-b0b9-479a-b392-eb69322d192a.aws.hashicorp.cloud:8200"