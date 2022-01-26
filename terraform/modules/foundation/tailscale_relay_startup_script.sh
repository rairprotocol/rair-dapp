#!/bin/bash

set -ex

echo "TAILSCALE STARTUP SCRIPT FIRES"
echo "${test}"

echo "Tailscale instance startup"

# Install directions here:
# https://tailscale.com/download/linux/debian-stretch

sudo apt-get install apt-transport-https
curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.gpg | sudo apt-key add -
curl -fsSL https://pkgs.tailscale.com/stable/debian/stretch.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt-get update
sudo apt-get install tailscale

TAILSCALE_AUTH_SECRET_NAME={tailscale_auth_key_secret_name}

# Pull auth key from Secrets Manager
# list all versions of the secret

gcloud secrets versions list $TAILSCALE_AUTH_KEY | jq .

# select latest version
# gcloud secrets versions access 123 --secret=$TAILSCALE_AUTH_KEY

TAILSCALE_AUTH_KEY=""

sudo tailscale up \
  --advertise-tags= {tags} \
  --advertise-routes={advertised_routes} \
  --authkey=$TAILSCALE_AUTH_KEY